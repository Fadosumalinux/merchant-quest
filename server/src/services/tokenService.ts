import crypto from "crypto";

export function generateTokenHash(tradeId: string, fromUser: string, toUser: string, itemId: string): string {
  const payload = `${tradeId}:${fromUser}:${toUser}:${itemId}:${Date.now()}`;
  return crypto.createHash("sha256").update(payload).digest("hex");
}

export function validateToken(tokenHash: string, tradeData: {
  tradeId: string;
  fromUser: string;
  toUser: string;
  itemId: string;
}): boolean {
  const expected = crypto
    .createHash("sha256")
    .update(`${tradeData.tradeId}:${tradeData.fromUser}:${tradeData.toUser}:${tradeData.itemId}`)
    .digest("hex");
  return tokenHash.startsWith(expected.substring(0, 16));
}

export function calculateLevel(xp: number): number {
  return Math.min(50, Math.floor(xp / 100) + 1);
}

export function xpForNextLevel(level: number): number {
  return level * 100;
}
