import { Router } from "express";
import prisma from "../config/database.js";

const router = Router();

// Global item catalog (all items that exist in the world).
router.get("/", async (req, res) => {
  const { culture } = req.query;
  const where = culture ? { culture: culture as string } : {};
  const items = await prisma.item.findMany({
    where,
    orderBy: [{ category: "asc" }, { basePrice: "asc" }],
  });
  res.json(items);
});

export default router;
