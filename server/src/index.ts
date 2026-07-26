import express from "express";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import { config } from "./config/constants.js";
import authRoutes from "./routes/auth.js";
import zoneRoutes from "./routes/zones.js";
import tradeRoutes from "./routes/trades.js";
import inventoryRoutes from "./routes/inventory.js";
import achievementRoutes from "./routes/achievements.js";
import avatarRoutes from "./routes/avatars.js";
import reviewRoutes from "./routes/reviews.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

// API routes
app.use("/api/auth", authRoutes);
app.use("/api/zones", zoneRoutes);
app.use("/api/trades", tradeRoutes);
app.use("/api/inventory", inventoryRoutes);
app.use("/api/achievements", achievementRoutes);
app.use("/api/avatars", avatarRoutes);
app.use("/api/reviews", reviewRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", game: "merchant-quest", version: "2.0.0" });
});

// Serve frontend (compiled React app)
const clientDist = path.resolve(__dirname, "../../client/dist");
app.use(express.static(clientDist));

// SPA fallback: any non-API route returns index.html
app.get("*", (_req, res) => {
  res.sendFile(path.join(clientDist, "index.html"));
});

app.listen(config.port, "0.0.0.0", () => {
  console.log(`\n⚔️  Merchant Quest running at http://localhost:${config.port}\n`);
});
