import { Router } from "express";
import prisma from "../config/database.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";

const router = Router();

// Get all achievements
router.get("/", async (_req, res) => {
  const achievements = await prisma.achievement.findMany({
    orderBy: [{ tier: "asc" }, { category: "asc" }],
  });
  res.json(achievements);
});

// Get user's earned achievements
router.get("/mine", authMiddleware, async (req: AuthRequest, res) => {
  const userAchievements = await prisma.userAchievement.findMany({
    where: { userId: req.userId },
    include: { achievement: true },
    orderBy: { earnedAt: "desc" },
  });
  res.json(userAchievements);
});

// Attempt quiz to earn an achievement
router.post("/:achievementId/quiz", authMiddleware, async (req: AuthRequest, res) => {
  const { answer } = req.body;
  const achievement = await prisma.achievement.findUnique({
    where: { id: req.params.achievementId },
  });

  if (!achievement) {
    res.status(404).json({ error: "Achievement not found" });
    return;
  }

  if (!achievement.quizQuestion) {
    res.status(400).json({ error: "This achievement has no quiz" });
    return;
  }

  const existing = await prisma.userAchievement.findUnique({
    where: { userId_achievementId: { userId: req.userId!, achievementId: achievement.id } },
  });

  if (existing) {
    res.status(400).json({ error: "Already earned" });
    return;
  }

  // Flexible answer matching (case-insensitive, trim)
  const normalize = (s: string) => s.toLowerCase().trim().replace(/[^\w\s]/g, "");
  const correct = normalize(answer) === normalize(achievement.quizAnswer || "");

  if (!correct) {
    res.json({ passed: false, message: "Incorrect answer. Try again!" });
    return;
  }

  // Award achievement
  const [userAchievement] = await prisma.$transaction([
    prisma.userAchievement.create({
      data: {
        userId: req.userId!,
        achievementId: achievement.id,
        quizPassed: true,
      },
    }),
    prisma.user.update({
      where: { id: req.userId },
      data: {
        xp: { increment: achievement.xpReward },
        gold: { increment: achievement.goldReward },
      },
    }),
  ]);

  res.json({
    passed: true,
    message: `Badge earned: ${achievement.badgeEmoji} ${achievement.name}`,
    xpEarned: achievement.xpReward,
    goldEarned: achievement.goldReward,
    lessonText: achievement.lessonText,
  });
});

// Award achievement directly (from NPC interaction)
router.post("/:achievementId/earn", authMiddleware, async (req: AuthRequest, res) => {
  const achievement = await prisma.achievement.findUnique({
    where: { id: req.params.achievementId },
  });

  if (!achievement) {
    res.status(404).json({ error: "Achievement not found" });
    return;
  }

  const existing = await prisma.userAchievement.findUnique({
    where: { userId_achievementId: { userId: req.userId!, achievementId: achievement.id } },
  });

  if (existing) {
    res.status(400).json({ error: "Already earned" });
    return;
  }

  const [userAchievement] = await prisma.$transaction([
    prisma.userAchievement.create({
      data: { userId: req.userId!, achievementId: achievement.id, quizPassed: true },
    }),
    prisma.user.update({
      where: { id: req.userId },
      data: {
        xp: { increment: achievement.xpReward },
        gold: { increment: achievement.goldReward },
      },
    }),
  ]);

  res.json({
    achievement: userAchievement,
    message: `${achievement.badgeEmoji} ${achievement.name} earned!`,
    lessonText: achievement.lessonText,
  });
});

// Get achievement stats
router.get("/stats", authMiddleware, async (req: AuthRequest, res) => {
  const total = await prisma.achievement.count();
  const earned = await prisma.userAchievement.count({ where: { userId: req.userId } });
  const totalXp = await prisma.userAchievement.findMany({
    where: { userId: req.userId },
    include: { achievement: true },
  }).then((ua) => ua.reduce((sum, u) => sum + u.achievement.xpReward, 0));

  res.json({ total, earned, totalXp, percentage: Math.round((earned / total) * 100) });
});

export default router;
