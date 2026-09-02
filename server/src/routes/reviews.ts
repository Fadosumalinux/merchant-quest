import { Router } from "express";
import prisma from "../config/database.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";
import { applyXpAndGold } from "../services/gameService.js";
import { z } from "zod";

const router = Router();

const reviewSchema = z.object({
  tradeId: z.string(),
  rating: z.number().int().min(1).max(5),
  comment: z.string().optional(),
});

// Post a review for a trade
router.post("/", authMiddleware, async (req: AuthRequest, res) => {
  try {
    const data = reviewSchema.parse(req.body);

    const trade = await prisma.trade.findUnique({
      where: { id: data.tradeId },
    });

    if (!trade) {
      res.status(404).json({ error: "Trade not found" });
      return;
    }

    // Only participants can review
    if (trade.fromUserId !== req.userId && trade.toUserId !== req.userId) {
      res.status(403).json({ error: "Not a participant in this trade" });
      return;
    }

    // Determine who is reviewing whom
    const reviewedId = trade.fromUserId === req.userId ? trade.toUserId! : trade.fromUserId;

    // Check for duplicate review
    const existing = await prisma.review.findFirst({
      where: { tradeId: data.tradeId, reviewerId: req.userId },
    });

    if (existing) {
      res.status(400).json({ error: "Already reviewed this trade" });
      return;
    }

    const review = await prisma.review.create({
      data: {
        tradeId: data.tradeId,
        reviewerId: req.userId!,
        reviewedId,
        rating: data.rating,
        comment: data.comment,
      },
    });

    // Update user's reputation
    const avgRating = await prisma.review.aggregate({
      where: { reviewedId },
      _avg: { rating: true },
    });

    const newReputation = Math.round((avgRating._avg.rating || 0) * 20);
    await prisma.user.update({
      where: { id: reviewedId },
      data: { reputation: newReputation },
    });

    // Check for 5-star achievement
    const fiveStarCount = await prisma.review.count({
      where: { reviewedId, rating: 5 },
    });

    if (fiveStarCount >= 5) {
      const existingBadge = await prisma.userAchievement.findUnique({
        where: { userId_achievementId: { userId: reviewedId, achievementId: "ach-5-star" } },
      });

      if (!existingBadge) {
        const achievement = await prisma.achievement.findUnique({ where: { id: "ach-5-star" } });
        if (achievement) {
          await prisma.$transaction(async (tx) => {
            await tx.userAchievement.create({
              data: { userId: reviewedId, achievementId: "ach-5-star", quizPassed: true },
            });
            await applyXpAndGold(tx, reviewedId, achievement.xpReward, achievement.goldReward);
          });
        }
      }
    }

    res.status(201).json(review);
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: "Invalid data", details: err.errors });
      return;
    }
    res.status(500).json({ error: "Server error" });
  }
});

// Get reviews for a user
router.get("/user/:userId", async (req, res) => {
  const reviews = await prisma.review.findMany({
    where: { reviewedId: req.params.userId as string },
    include: { reviewer: { select: { username: true } }, trade: { include: { item: true } } },
    orderBy: { createdAt: "desc" },
    take: 20,
  });

  const avg = await prisma.review.aggregate({
    where: { reviewedId: req.params.userId as string },
    _avg: { rating: true },
    _count: { rating: true },
  });

  res.json({
    reviews,
    averageRating: avg._avg.rating,
    totalReviews: avg._count.rating,
  });
});

export default router;
