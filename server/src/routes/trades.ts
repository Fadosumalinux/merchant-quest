import { Router } from "express";
import { Prisma } from "@prisma/client";
import prisma from "../config/database.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";
import { generateTokenHash, validateToken } from "../services/tokenService.js";
import {
  xpForTrade,
  npcSellPrice,
  npcBuyPrice,
  npcSellsItem,
  applyXpAndGold,
  checkTradeMilestones,
  getNpcShopItems,
} from "../services/gameService.js";
import { z } from "zod";

const router = Router();

const p2pTradeSchema = z.object({
  toUserId: z.string().min(1),
  itemId: z.string(),
  quantity: z.number().int().positive(),
  zoneId: z.string(),
});

const npcTradeSchema = z.object({
  type: z.enum(["buy", "sell"]),
  itemId: z.string(),
  quantity: z.number().int().positive(),
});

// Roles that actually trade with the player.
const TRADER_ROLES = new Set(["merchant", "blacksmith", "quest_giver"]);

async function resolveUser(target: string) {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(target);
  return isUuid
    ? prisma.user.findUnique({ where: { id: target } })
    : prisma.user.findUnique({ where: { username: target } });
}

// ── PLAYER TO PLAYER TRADE ──
// fromUser sells to toUser: toUser pays gold, fromUser delivers the items.
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const data = p2pTradeSchema.parse(req.body);

    const fromUser = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { inventory: true },
    });
    if (!fromUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const toUser = await resolveUser(data.toUserId);
    if (!toUser) {
      res.status(404).json({ error: "Recipient not found" });
      return;
    }
    if (toUser.id === fromUser.id) {
      res.status(400).json({ error: "Cannot trade with yourself" });
      return;
    }

    const item = await prisma.item.findUnique({ where: { id: data.itemId } });
    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    const inventoryItem = fromUser.inventory.find((i) => i.itemId === data.itemId);
    if (!inventoryItem || inventoryItem.quantity < data.quantity) {
      res.status(400).json({ error: "Insufficient items" });
      return;
    }

    const totalPrice = item.basePrice * data.quantity;
    if (toUser.gold < totalPrice) {
      res.status(400).json({ error: "Buyer has insufficient gold" });
      return;
    }

    const result = await prisma.$transaction(async (tx) => {
      const trade = await tx.trade.create({
        data: {
          fromUserId: fromUser.id,
          toUserId: toUser.id,
          zoneId: data.zoneId,
          itemId: data.itemId,
          quantity: data.quantity,
          totalPrice,
          tokenHash: "",
          status: "completed",
        },
      });

      const tokenHash = generateTokenHash(trade.id, fromUser.id, toUser.id, data.itemId, data.quantity, totalPrice);

      await tx.trade.update({ where: { id: trade.id }, data: { tokenHash } });
      await tx.token.create({
        data: {
          tradeId: trade.id,
          hash: tokenHash,
          fromUser: fromUser.id,
          toUser: toUser.id,
          itemId: data.itemId,
          quantity: data.quantity,
        },
      });

      // Items flow from seller to buyer
      await tx.inventory.update({
        where: { userId_itemId: { userId: fromUser.id, itemId: data.itemId } },
        data: { quantity: { decrement: data.quantity } },
      });

      const buyerEntry = await tx.inventory.findUnique({
        where: { userId_itemId: { userId: toUser.id, itemId: data.itemId } },
      });
      if (buyerEntry) {
        await tx.inventory.update({
          where: { id: buyerEntry.id },
          data: { quantity: { increment: data.quantity } },
        });
      } else {
        await tx.inventory.create({
          data: { userId: toUser.id, itemId: data.itemId, quantity: data.quantity },
        });
      }

      // Gold flows from buyer to seller
      await tx.user.update({ where: { id: toUser.id }, data: { gold: { decrement: totalPrice } } });
      const seller = await tx.user.update({ where: { id: fromUser.id }, data: { gold: { increment: totalPrice } } });

      // XP for the seller
      const xpGain = xpForTrade(totalPrice, data.quantity);
      const { newLevel } = await applyXpAndGold(tx, fromUser.id, xpGain, 0);

      // Trade stats + milestones
      const updated = await tx.user.update({
        where: { id: fromUser.id },
        data: { totalTrades: { increment: 1 }, honestTrades: { increment: 1 } },
      });
      const milestones = await checkTradeMilestones(tx, fromUser.id, updated.totalTrades);

      return { trade, token: tokenHash, xpGain, newLevel, sellerGold: seller.gold, milestones };
    });

    res.status(201).json({
      message: "Trade completed!",
      trade: result.trade,
      token: result.token,
      xpGained: result.xpGain,
      newLevel: result.newLevel,
      milestones: result.milestones,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid data", details: err.errors });
      return;
    }
    res.status(500).json({ error: "Server error" });
  }
});

// ── NPC TRADE (buy from NPC / sell to NPC) ──
router.post("/npc/:npcId", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const data = npcTradeSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { inventory: true },
    });
    if (!user) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const npc = await prisma.nPC.findUnique({
      where: { id: req.params.npcId as string },
      include: { zone: true },
    });
    if (!npc) {
      res.status(404).json({ error: "NPC not found" });
      return;
    }
    if (!TRADER_ROLES.has(npc.role)) {
      res.status(403).json({ error: `${npc.name} no comerciar contigo` });
      return;
    }

    const item = await prisma.item.findUnique({ where: { id: data.itemId } });
    if (!item) {
      res.status(404).json({ error: "Item not found" });
      return;
    }

    const totalPrice = data.type === "buy" ? npcSellPrice(item, npc.zone) * data.quantity : npcBuyPrice(item, npc.zone) * data.quantity;

    // Market user acts as the NPC's counterparty.
    const market = await prisma.user.upsert({
      where: { email: "market@merchant-quest.local" },
      update: {},
      create: {
        email: "market@merchant-quest.local",
        username: "Mercado",
        password: "!",
        gold: 1_000_000,
      },
    });

    const userEntry = user.inventory.find((i) => i.itemId === data.itemId);

    if (data.type === "buy") {
      if (user.gold < totalPrice) {
        res.status(400).json({ error: "Oro insuficiente" });
        return;
      }
    } else {
      if (!npcSellsItem(item.culture, npc.zone.culture)) {
        res.status(403).json({ error: `${npc.name} no compra ese artículo aquí` });
        return;
      }
      if (!userEntry || userEntry.quantity < data.quantity) {
        res.status(400).json({ error: "No tienes suficientes items" });
        return;
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      const player = data.type === "buy" ? user.id : market.id;
      const npcSide = data.type === "buy" ? market.id : user.id;

      const trade = await tx.trade.create({
        data: {
          fromUserId: player,
          toUserId: npcSide,
          zoneId: npc.zoneId,
          itemId: data.itemId,
          quantity: data.quantity,
          totalPrice,
          tokenHash: "",
          status: "completed",
        },
      });

      const tokenHash = generateTokenHash(trade.id, player, npcSide, data.itemId, data.quantity, totalPrice);

      await tx.trade.update({ where: { id: trade.id }, data: { tokenHash } });
      await tx.token.create({
        data: {
          tradeId: trade.id,
          hash: tokenHash,
          fromUser: player,
          toUser: npcSide,
          itemId: data.itemId,
          quantity: data.quantity,
        },
      });

      // Inventory: on buy the player receives, on sell the player delivers
      if (data.type === "buy") {
        await addInventory(tx, user.id, data.itemId, data.quantity);
        await addInventory(tx, market.id, data.itemId, -data.quantity);
        await tx.user.update({ where: { id: user.id }, data: { gold: { decrement: totalPrice } } });
        await tx.user.update({ where: { id: market.id }, data: { gold: { increment: totalPrice } } });
      } else {
        await addInventory(tx, user.id, data.itemId, -data.quantity);
        await addInventory(tx, market.id, data.itemId, data.quantity);
        await tx.user.update({ where: { id: user.id }, data: { gold: { increment: totalPrice } } });
        await tx.user.update({ where: { id: market.id }, data: { gold: { decrement: totalPrice } } });
      }

      // XP + reputation for the player
      const xpGain = xpForTrade(totalPrice, data.quantity);
      const { newLevel } = await applyXpAndGold(tx, user.id, xpGain, 0);
      await tx.user.update({
        where: { id: user.id },
        data: {
          totalTrades: { increment: 1 },
          honestTrades: { increment: 1 },
          reputation: { increment: npc.tradeBonus },
        },
      });

      const updatedUser = await tx.user.findUniqueOrThrow({ where: { id: user.id } });
      const milestones = await checkTradeMilestones(tx, user.id, updatedUser.totalTrades);

      return { trade, token: tokenHash, xpGain, newLevel, milestones, gold: updatedUser.gold };
    });

    res.status(201).json({
      message: data.type === "buy" ? "Compra completada!" : "Venta completada!",
      trade: result.trade,
      token: result.token,
      xpGained: result.xpGain,
      newLevel: result.newLevel,
      gold: result.gold,
      milestones: result.milestones,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid data", details: err.errors });
      return;
    }
    res.status(500).json({ error: "Server error" });
  }
});

// Shop: items this NPC sells, with zone-adjusted prices.
router.get("/npc/:npcId/shop", authMiddleware, async (req: AuthRequest, res) => {
  const npc = await prisma.nPC.findUnique({
    where: { id: req.params.npcId as string },
    include: { zone: true },
  });
  if (!npc) {
    res.status(404).json({ error: "NPC not found" });
    return;
  }
  if (!TRADER_ROLES.has(npc.role)) {
    res.json({ items: [] });
    return;
  }
  const items = await getNpcShopItems(prisma, npc.zone.culture);
  res.json({ npc, items });
});

// Verify a token: recompute the hash and validate the transaction.
router.get("/verify/:tokenHash", authMiddleware, async (req: AuthRequest, res) => {
  const token = await prisma.token.findUnique({
    where: { hash: req.params.tokenHash as string },
    include: { trade: true },
  });

  if (!token) {
    res.status(404).json({ valid: false, error: "Token not found" });
    return;
  }

  const isValid = validateToken(token.hash, {
    tradeId: token.tradeId,
    fromUser: token.fromUser,
    toUser: token.toUser,
    itemId: token.itemId,
    quantity: token.quantity,
    totalPrice: token.trade.totalPrice,
  });

  if (isValid !== token.valid) {
    await prisma.token.update({
      where: { id: token.id },
      data: { valid: isValid },
    });
  }

  const from = await prisma.user.findUnique({ where: { id: token.fromUser }, select: { username: true } });
  const to = await prisma.user.findUnique({ where: { id: token.toUser }, select: { username: true } });
  const item = await prisma.item.findUnique({ where: { id: token.itemId }, select: { name: true, emoji: true } });

  res.json({
    valid: isValid,
    fromUser: from?.username || token.fromUser,
    toUser: to?.username || token.toUser,
    itemId: token.itemId,
    itemName: item?.name || token.itemId,
    itemEmoji: item?.emoji || "",
    quantity: token.quantity,
    totalPrice: token.trade.totalPrice,
    createdAt: token.createdAt,
  });
});

// Get user trade history
router.get("/history", authMiddleware, async (req: AuthRequest, res) => {
  const trades = await prisma.trade.findMany({
    where: { OR: [{ fromUserId: req.userId }, { toUserId: req.userId }] },
    include: { item: true, fromUser: { select: { username: true } }, toUser: { select: { username: true } } },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  res.json(trades);
});

// Shared helper to add/remove inventory rows (upsert with clamping).
async function addInventory(tx: Prisma.TransactionClient, userId: string, itemId: string, delta: number) {
  const entry = await tx.inventory.findUnique({ where: { userId_itemId: { userId, itemId } } });
  const next = (entry?.quantity || 0) + delta;
  if (next <= 0) {
    if (entry) await tx.inventory.delete({ where: { id: entry.id } });
    return;
  }
  if (entry) {
    await tx.inventory.update({ where: { id: entry.id }, data: { quantity: next } });
  } else {
    await tx.inventory.create({ data: { userId, itemId, quantity: next } });
  }
}

export default router;
