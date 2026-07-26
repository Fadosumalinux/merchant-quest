import { Router } from "express";
import prisma from "../config/database.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";
import { generateTokenHash, calculateLevel, xpForNextLevel } from "../services/tokenService.js";
import { z } from "zod";

const router = Router();

const tradeSchema = z.object({
  toUserId: z.string().uuid(),
  itemId: z.string(),
  quantity: z.number().int().positive(),
  zoneId: z.string(),
});

// Create a trade
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const data = tradeSchema.parse(req.body);

    const fromUser = await prisma.user.findUnique({
      where: { id: req.userId },
      include: { inventory: true },
    });
    if (!fromUser) {
      res.status(404).json({ error: "User not found" });
      return;
    }

    const toUser = await prisma.user.findUnique({ where: { id: data.toUserId } });
    if (!toUser) {
      res.status(404).json({ error: "Recipient not found" });
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

    // Create trade + token in transaction
    const result = await prisma.$transaction(async (tx) => {
      const trade = await tx.trade.create({
        data: {
          fromUserId: req.userId!,
          toUserId: data.toUserId,
          zoneId: data.zoneId,
          itemId: data.itemId,
          quantity: data.quantity,
          totalPrice,
          tokenHash: "",
          status: "pending",
        },
      });

      const tokenHash = generateTokenHash(trade.id, req.userId!, data.toUserId, data.itemId);

      await tx.trade.update({
        where: { id: trade.id },
        data: { tokenHash },
      });

      const token = await tx.token.create({
        data: {
          tradeId: trade.id,
          hash: tokenHash,
          fromUser: req.userId!,
          toUser: data.toUserId,
          itemId: data.itemId,
          quantity: data.quantity,
        },
      });

      // Transfer inventory
      await tx.inventory.update({
        where: { userId_itemId: { userId: req.userId!, itemId: data.itemId } },
        data: { quantity: { decrement: data.quantity } },
      });

      const existingRecipient = await tx.inventory.findUnique({
        where: { userId_itemId: { userId: data.toUserId, itemId: data.itemId } },
      });

      if (existingRecipient) {
        await tx.inventory.update({
          where: { id: existingRecipient.id },
          data: { quantity: { increment: data.quantity } },
        });
      } else {
        await tx.inventory.create({
          data: { userId: data.toUserId, itemId: data.itemId, quantity: data.quantity },
        });
      }

      // Transfer gold
      await tx.user.update({
        where: { id: data.toUserId },
        data: { gold: { increment: totalPrice } },
      });
      await tx.user.update({
        where: { id: req.userId! },
        data: { gold: { decrement: totalPrice } },
      });

      // Award XP
      const xpGain = Math.floor(totalPrice * 0.1) + data.quantity * 10;
      const updatedUser = await tx.user.update({
        where: { id: req.userId! },
        data: { xp: { increment: xpGain } },
      });

      const newLevel = calculateLevel(updatedUser.xp);
      if (newLevel > updatedUser.level) {
        await tx.user.update({
          where: { id: req.userId! },
          data: { level: newLevel },
        });
      }

      return { trade, token, xpGain, newLevel };
    });

    res.status(201).json({
      message: "Trade completed!",
      trade: result.trade,
      token: result.token.hash,
      xpGained: result.xpGain,
      newLevel: result.newLevel,
    });
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid data", details: err.errors });
      return;
    }
    res.status(500).json({ error: "Server error" });
  }
});

// Verify a token
router.get("/verify/:tokenHash", authMiddleware, async (req: AuthRequest, res) => {
  const token = await prisma.token.findUnique({
    where: { hash: req.params.tokenHash },
    include: { trade: true },
  });

  if (!token) {
    res.status(404).json({ valid: false, error: "Token not found" });
    return;
  }

  res.json({
    valid: token.valid,
    fromUser: token.fromUser,
    toUser: token.toUser,
    itemId: token.itemId,
    quantity: token.quantity,
    createdAt: token.createdAt,
  });
});

// Get user trade history
router.get("/history", authMiddleware, async (req: AuthRequest, res) => {
  const trades = await prisma.trade.findMany({
    where: { OR: [{ fromUserId: req.userId }, { toUserId: req.userId }] },
    include: { item: true, fromUser: true, toUser: true },
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  res.json(trades);
});

export default router;
