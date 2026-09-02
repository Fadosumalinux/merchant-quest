import crypto from "crypto";

const XP_PER_LEVEL = 100;
const MAX_LEVEL = 50;

// Deterministic SHA-256 hash for a trade. The token is reproducible:
// anyone can recompute it from the trade data to prove its authenticity.
export function generateTokenHash(
  tradeId: string,
  fromUser: string,
  toUser: string,
  itemId: string,
  quantity: number,
  totalPrice: number
): string {
  const payload = `${tradeId}:${fromUser}:${toUser}:${itemId}:${quantity}:${totalPrice}`;
  return crypto.createHash("sha256").update(payload).digest("hex");
}

// Recomputes the expected hash and compares it in full.
export function validateToken(tokenHash: string, tradeData: {
  tradeId: string;
  fromUser: string;
  toUser: string;
  itemId: string;
  quantity: number;
  totalPrice: number;
}): boolean {
  const expected = generateTokenHash(
    tradeData.tradeId,
    tradeData.fromUser,
    tradeData.toUser,
    tradeData.itemId,
    tradeData.quantity,
    tradeData.totalPrice
  );
  return tokenHash === expected;
}

export function calculateLevel(xp: number): number {
  return Math.min(MAX_LEVEL, Math.floor(xp / XP_PER_LEVEL) + 1);
}

export function xpForNextLevel(level: number): number {
  return level * XP_PER_LEVEL;
}
