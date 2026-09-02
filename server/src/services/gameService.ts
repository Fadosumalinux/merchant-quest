import type { Prisma, PrismaClient } from "@prisma/client";
import { calculateLevel } from "./tokenService.js";

type Tx = Prisma.TransactionClient;

// ── LOCAL MARKET PRICING ──
// An item's value depends on where you sell it:
//  - native goods (same culture as the zone) are abundant  -> factor 1.0
//  - foreign goods are scarce                               -> factor 1.5
// The NPC always keeps a ~10% margin on what it buys.
export function localPriceFactor(zoneCulture: string, itemCulture: string | null): number {
  if (!itemCulture || itemCulture === "universal") {
    return zoneCulture === "universal" ? 1.0 : 1.5;
  }
  return itemCulture === zoneCulture ? 1.0 : 1.5;
}

export function npcSellPrice(item: { basePrice: number; culture: string | null }, zone: { culture: string }): number {
  return Math.round(item.basePrice * localPriceFactor(zone.culture, item.culture));
}

export function npcBuyPrice(item: { basePrice: number; culture: string | null }, zone: { culture: string }): number {
  return Math.max(1, Math.round(item.basePrice * localPriceFactor(zone.culture, item.culture) * 0.9));
}

// Items an NPC sells: its own culture's goods + universal goods.
export function npcSellsItem(itemCulture: string | null, zoneCulture: string): boolean {
  return !itemCulture || itemCulture === "universal" || itemCulture === zoneCulture;
}

// ── XP & LEVELING ──
export function xpForTrade(totalPrice: number, quantity: number): number {
  return Math.floor(totalPrice * 0.1) + quantity * 10;
}

export function applyXpAndGold(
  tx: Tx,
  userId: string,
  xp: number,
  gold: number
): Promise<{ newXp: number; newLevel: number }> {
  return tx.user
    .update({
      where: { id: userId },
      data: {
        xp: { increment: xp },
        gold: { increment: gold },
      },
    })
    .then((user) => {
      const newLevel = calculateLevel(user.xp);
      if (newLevel > user.level) {
        return tx.user
          .update({ where: { id: userId }, data: { level: newLevel } })
          .then(() => ({ newXp: user.xp, newLevel }));
      }
      return { newXp: user.xp, newLevel };
    });
}

// ── ACHIEVEMENTS ──
// Awards an achievement if the user doesn't have it yet, granting XP/gold
// and recomputing level inside the same transaction.
export async function awardAchievementIfEligible(tx: Tx, userId: string, achievementId: string) {
  const existing = await tx.userAchievement.findUnique({
    where: { userId_achievementId: { userId, achievementId } },
  });
  if (existing) return { awarded: false, achievement: null };

  const achievement = await tx.achievement.findUnique({ where: { id: achievementId } });
  if (!achievement) return { awarded: false, achievement: null };

  await tx.userAchievement.create({
    data: { userId, achievementId, quizPassed: true },
  });
  await applyXpAndGold(tx, userId, achievement.xpReward, achievement.goldReward);

  return { awarded: true, achievement };
}

// Milestone trading badges that are earned automatically.
const TRADE_MILESTONES: { count: number; achievementId: string }[] = [
  { count: 1, achievementId: "ach-first-trade" },
  { count: 10, achievementId: "ach-10-trades" },
  { count: 50, achievementId: "ach-50-trades" },
  { count: 100, achievementId: "ach-100-trades" },
];

export async function checkTradeMilestones(tx: Tx, userId: string, totalTrades: number) {
  const awarded: { id: string; name: string; xp: number; gold: number }[] = [];
  for (const milestone of TRADE_MILESTONES) {
    if (totalTrades >= milestone.count) {
      const { awarded: didAward, achievement } = await awardAchievementIfEligible(tx, userId, milestone.achievementId);
      if (didAward && achievement) {
        awarded.push({ id: achievement.id, name: achievement.name, xp: achievement.xpReward, gold: achievement.goldReward });
      }
    }
  }
  return awarded;
}

// Market helper: builds/refreshes the NPC shop inventory for a zone.
export async function getNpcShopItems(prisma: PrismaClient, zoneCulture: string) {
  const items = await prisma.item.findMany({
    where: { OR: [{ culture: null }, { culture: "universal" }, { culture: zoneCulture }] },
    orderBy: { basePrice: "asc" },
  });
  return items.map((item) => ({
    ...item,
    sellPrice: npcSellPrice(item, { culture: zoneCulture }),
  }));
}
