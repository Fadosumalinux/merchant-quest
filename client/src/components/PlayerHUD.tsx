import type { User } from "../types";

interface PlayerHUDProps {
  user: User;
}

const RARITY_COLORS: Record<string, string> = {
  common: "#aaa",
  uncommon: "#4a9",
  rare: "#48f",
  epic: "#a4f",
  legendary: "#fa0",
};

export default function PlayerHUD({ user }: PlayerHUDProps) {
  const xpForNext = user.level * 100;
  const xpProgress = (user.xp % 100);

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <span style={{ fontSize: 18, fontWeight: "bold", color: "#ffd700" }}>
          ⚔️ {user.username}
        </span>
        <span style={{ fontSize: 13, color: "#aaa" }}>
          Nivel {user.level}
        </span>
      </div>

      <div style={barContainerStyle}>
        <div style={labelStyle}>XP</div>
        <div style={barBgStyle}>
          <div style={{ ...barFillStyle, width: `${xpProgress}%`, background: "linear-gradient(90deg, #4a9, #8f4)" }} />
        </div>
        <span style={{ fontSize: 11, color: "#8a8" }}>{user.xp} / {xpForNext}</span>
      </div>

      <div style={goldStyle}>
        💰 {user.gold} oro
      </div>

      <div style={inventoryStyle}>
        <div style={{ fontSize: 13, fontWeight: "bold", color: "#ddd", marginBottom: 4 }}>Inventario</div>
        {user.inventory.length === 0 && (
          <div style={{ fontSize: 12, color: "#666" }}>Vacío — ¡ve a comerciar!</div>
        )}
        {user.inventory.map((inv) => (
          <div key={inv.id} style={itemStyle}>
            <span style={{ color: RARITY_COLORS[inv.item.rarity] }}>
              {inv.item.name}
            </span>
            <span style={{ color: "#888", fontSize: 11 }}>x{inv.quantity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  background: "#1a1a2e",
  border: "1px solid #333",
  borderRadius: 8,
  padding: 12,
  display: "flex",
  flexDirection: "column",
  gap: 10,
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const barContainerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  gap: 8,
};

const labelStyle: React.CSSProperties = {
  fontSize: 11,
  fontWeight: "bold",
  color: "#8f8",
  width: 24,
};

const barBgStyle: React.CSSProperties = {
  flex: 1,
  height: 8,
  background: "#333",
  borderRadius: 4,
  overflow: "hidden",
};

const barFillStyle: React.CSSProperties = {
  height: "100%",
  borderRadius: 4,
  transition: "width 0.3s",
};

const goldStyle: React.CSSProperties = {
  fontSize: 15,
  color: "#ffd700",
  fontWeight: "bold",
};

const inventoryStyle: React.CSSProperties = {
  borderTop: "1px solid #333",
  paddingTop: 8,
  maxHeight: 200,
  overflowY: "auto",
};

const itemStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  padding: "3px 0",
  fontSize: 13,
};
