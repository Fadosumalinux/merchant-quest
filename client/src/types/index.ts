export interface User {
  id: string;
  email: string;
  username: string;
  gold: number;
  xp: number;
  level: number;
  reputation: number;
  totalTrades: number;
  honestTrades: number;
  avatarStyle?: string;
  inventory: InventoryItem[];
}

export interface InventoryItem {
  id: string;
  quantity: number;
  item: Item;
}

export interface Item {
  id: string;
  name: string;
  description: string;
  category: string;
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  basePrice: number;
  emoji: string;
  culture?: string;
}

export interface Zone {
  id: string;
  name: string;
  description: string;
  culture: string;
  requiredLevel: number;
  mapX: number;
  mapY: number;
  width: number;
  height: number;
  bgGradient?: string;
  npcs: NPC[];
  waypoints: Waypoint[];
  achievements?: Achievement[];
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  culture: string;
  personality: string;
  avatarEmoji: string;
  dialog: string;
  tradeBonus: number;
  teachesBadge?: string;
}

export interface Waypoint {
  id: string;
  name: string;
  x: number;
  y: number;
  type: "trade_post" | "auction_house" | "portal" | "treasure" | "lesson_shrine";
}

export interface Trade {
  id: string;
  fromUserId: string;
  toUserId: string;
  itemId: string;
  quantity: number;
  totalPrice: number;
  tokenHash: string;
  status: string;
  rating?: number;
  createdAt: string;
  item: Item;
  fromUser: { username: string };
  toUser: { username: string } | null;
}

export interface TokenData {
  valid: boolean;
  fromUser: string;
  toUser: string;
  itemId: string;
  quantity: number;
  createdAt: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  badgeEmoji: string;
  badgeColor: string;
  category: string;
  tier: string;
  xpReward: number;
  goldReward: number;
  requiredXp: number;
  lessonText?: string;
  quizQuestion?: string;
  zoneId?: string;
}

export interface UserAchievement {
  id: string;
  achievementId: string;
  earnedAt: string;
  quizPassed: boolean;
  achievement: Achievement;
}

export interface Avatar {
  id: string;
  name: string;
  culture: string;
  emoji: string;
  accessory?: string;
  description: string;
  unlockLevel: number;
  price: number;
}

export interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  reviewer: { username: string };
}

export const CULTURE_CONFIG: Record<string, { name: string; emoji: string; color: string; bg: string }> = {
  universal: { name: "Universal", emoji: "🌍", color: "#4a9", bg: "#1a3a2a" },
  gypsy: { name: "Gitano", emoji: "💃", color: "#c44569", bg: "#3a1525" },
  chinese: { name: "Chino", emoji: "🐉", color: "#cc3300", bg: "#3a1515" },
  moroccan: { name: "Marroquí", emoji: "🕌", color: "#e8a838", bg: "#3a2a10" },
  wallstreet: { name: "Wall Street", emoji: "📊", color: "#4a6aaa", bg: "#151a3a" },
  fantasy: { name: "Fantasía", emoji: "🏴‍☠️", color: "#8a5aaa", bg: "#251a3a" },
};

export const TIER_CONFIG: Record<string, { emoji: string; color: string }> = {
  bronze: { emoji: "🥉", color: "#cd7f32" },
  silver: { emoji: "🥈", color: "#c0c0c0" },
  gold: { emoji: "🥇", color: "#ffd700" },
  platinum: { emoji: "💎", color: "#e5e4e2" },
  diamond: { emoji: "👑", color: "#b9f2ff" },
  legendary: { emoji: "✨", color: "#ff6b9d" },
};
