import { Router } from "express";
import prisma from "../config/database.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";

const router = Router();

// Get all available avatars
router.get("/", async (_req, res) => {
  const avatars = await prisma.avatar.findMany({
    orderBy: [{ unlockLevel: "asc" }, { culture: "asc" }],
  });
  res.json(avatars);
});

// Get user's current avatar
router.get("/mine", authMiddleware, async (req: AuthRequest, res) => {
  const user = await prisma.user.findUnique({
    where: { id: req.userId },
    select: { avatarStyle: true },
  });
  res.json({ avatarStyle: user?.avatarStyle });
});

// Equip an avatar
router.post("/equip", authMiddleware, async (req: AuthRequest, res) => {
  const { avatarId } = req.body;

  const avatar = await prisma.avatar.findUnique({ where: { id: avatarId } });
  if (!avatar) {
    res.status(404).json({ error: "Avatar not found" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  if (user.level < avatar.unlockLevel) {
    res.status(403).json({ error: `Level ${avatar.unlockLevel} required` });
    return;
  }

  if (user.gold < avatar.price) {
    res.status(400).json({ error: `Need ${avatar.price} gold` });
    return;
  }

  // Deduct gold and equip
  await prisma.user.update({
    where: { id: req.userId },
    data: {
      avatarStyle: JSON.stringify({
        avatarId: avatar.id,
        emoji: avatar.emoji,
        name: avatar.name,
        accessory: avatar.accessory,
        culture: avatar.culture,
      }),
      gold: { decrement: avatar.price },
    },
  });

  res.json({
    message: `Avatar equiped: ${avatar.emoji} ${avatar.name}`,
    avatar,
  });
});

// Update avatar customization (colors, etc.)
router.put("/customize", authMiddleware, async (req: AuthRequest, res) => {
  const { style } = req.body;

  await prisma.user.update({
    where: { id: req.userId },
    data: { avatarStyle: JSON.stringify(style) },
  });

  res.json({ message: "Avatar updated", style });
});

export default router;
