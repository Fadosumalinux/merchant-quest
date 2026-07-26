export interface User {
  id: string;
  email: string;
  username: string;
  gold: number;
  xp: number;
  level: number;
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
  rarity: "common" | "uncommon" | "rare" | "epic" | "legendary";
  basePrice: number;
  imageUrl?: string;
}

export interface Zone {
  id: string;
  name: string;
  description: string;
  requiredLevel: number;
  mapX: number;
  mapY: number;
  width: number;
  height: number;
  npcs: NPC[];
  waypoints: Waypoint[];
}

export interface NPC {
  id: string;
  name: string;
  role: string;
  dialog: string;
}

export interface Waypoint {
  id: string;
  name: string;
  x: number;
  y: number;
  type: "trade_post" | "auction_house" | "portal" | "treasure";
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
