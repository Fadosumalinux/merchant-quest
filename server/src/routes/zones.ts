import { Router } from "express";
import prisma from "../config/database.js";
import { authMiddleware, AuthRequest } from "../middleware/auth.js";

const router = Router();

router.get("/", async (_req, res) => {
  const zones = await prisma.zone.findMany({
    include: { npcs: true, waypoints: true },
    orderBy: { requiredLevel: "asc" },
  });
  res.json(zones);
});

router.get("/:id", async (req, res) => {
  const zone = await prisma.zone.findUnique({
    where: { id: req.params.id as string },
    include: { npcs: true, waypoints: true },
  });
  if (!zone) {
    res.status(404).json({ error: "Zone not found" });
    return;
  }
  res.json(zone);
});

router.post("/travel/:id", authMiddleware, async (req: AuthRequest, res) => {
  const zone = await prisma.zone.findUnique({ where: { id: req.params.id as string } });
  if (!zone) {
    res.status(404).json({ error: "Zone not found" });
    return;
  }

  const user = await prisma.user.findUnique({ where: { id: req.userId } });
  if (!user) {
    res.status(404).json({ error: "User not found" });
    return;
  }

  if (user.level < zone.requiredLevel) {
    res.status(403).json({ error: `Level ${zone.requiredLevel} required to enter ${zone.name}` });
    return;
  }

  res.json({ message: `Welcome to ${zone.name}!`, zone });
});

export default router;
