import express from "express";
import cors from "cors";
import { config } from "./config/constants.js";
import authRoutes from "./routes/auth.js";
import zoneRoutes from "./routes/zones.js";
import tradeRoutes from "./routes/trades.js";
import inventoryRoutes from "./routes/inventory.js";

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/zones", zoneRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/inventory", inventoryRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", game: "merchant-quest", version: "1.0.0" });
});

app.listen(config.port, () => {
  console.log(`Merchant Quest server running on port ${config.port}`);
});
