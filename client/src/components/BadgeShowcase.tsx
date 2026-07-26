import { useState, useEffect } from "react";
import { api } from "../utils/api";
import type { UserAchievement } from "../types";
import { TIER_CONFIG } from "../types";

interface BadgeShowcaseProps {
  userId?: string;
}

export default function BadgeShowcase({ userId }: BadgeShowcaseProps) {
  const [earned, setEarned] = useState<UserAchievement[]>([]);

  useEffect(() => {
    api.achievements.mine().then(setEarned);
  }, [userId]);

  if (earned.length === 0) return null;

  return (
    <div style={containerStyle}>
      <div style={{ fontSize: 12, fontWeight: "bold", color: "#ffd700", marginBottom: 6 }}>
        🏆 Insignias ({earned.length})
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {earned.slice(0, 12).map((ua) => {
          const tier = TIER_CONFIG[ua.achievement.tier] || TIER_CONFIG.bronze;
          return (
            <div
              key={ua.id}
              title={`${ua.achievement.name} — ${ua.achievement.description}`}
              style={{
                width: 32,
                height: 32,
                borderRadius: "50%",
                background: `${tier.color}22`,
                border: `2px solid ${tier.color}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 16,
                cursor: "default",
              }}
            >
              {ua.achievement.badgeEmoji}
            </div>
          );
        })}
        {earned.length > 12 && (
          <div style={{
            width: 32,
            height: 32,
            borderRadius: "50%",
            background: "#333",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 10,
            color: "#aaa",
          }}>
            +{earned.length - 12}
          </div>
        )}
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  background: "#1a1a2e",
  border: "1px solid #333",
  borderRadius: 8,
  padding: 10,
};
