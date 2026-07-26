import express from "express";
import cors from "cors";
import { config } from "./config/constants.js";
import authRoutes from "./routes/auth.js";
import zoneRoutes from "./routes/zones.js";
import tradeRoutes from "./routes/trades.js";
import inventoryRoutes from "./routes/inventory.js";
import achievementRoutes from "./routes/achievements.js";
import avatarRoutes from "./routes/avatars.js";
import reviewRoutes from "./routes/reviews.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/zones", zoneRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/avatars", avatarRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", game: "merchant-quest", version: "2.0.0", features: ["achievements", "avatars", "reviews", "cultural-npcs", "lessons"] });
});

app.listen(config.port, () => {
  console.log(`Merchant Quest server v2.0 running on port ${config.port}`);
});
