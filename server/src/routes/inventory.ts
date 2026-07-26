import { Router } from "express";
import prisma from "../config/database.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";

const router = Router();

router.get("/", authMiddleware, async (req: AuthRequest, res) => {
  const inventory = await prisma.inventory.findMany({
    where: { userId: req.userId },
    include: { item: true },
  });
  res.json(inventory);
});

router.post("/equip", authMiddleware, async (req: AuthRequest, res) => {
  const { itemId } = req.body;
  const item = await prisma.inventory.findUnique({
    where: { userId_itemId: { userId: req.userId!, itemId } },
    include: { item: true },
  });

  if (!item) {
    res.status(404).json({ error: "Item not in inventory" });
    return;
  }

  res.json({ message: `Equipped ${item.item.name}`, item });
});

export default router;
