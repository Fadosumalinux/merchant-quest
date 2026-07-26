import { useState, useEffect } from "react";
import { api } from "../utils/api";
import type { Avatar } from "../types";
import { CULTURE_CONFIG } from "../types";

interface AvatarSelectorProps {
  userLevel: number;
  userGold: number;
  onClose: () => void;
  onEquip: () => void;
}

export default function AvatarSelector({ userLevel, userGold, onClose, onEquip }: AvatarSelectorProps) {
  const [avatars, setAvatars] = useState<Avatar[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [equipped, setEquipped] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    api.avatars.list().then(setAvatars);
    api.avatars.mine().then((data) => {
      if (data.avatarStyle) {
        try {
          const parsed = JSON.parse(data.avatarStyle);
          setEquipped(parsed.avatarId);
        } catch {}
      }
    });
  }, []);

  const handleEquip = async (avatarId: string) => {
    try {
      await api.avatars.equip(avatarId);
      setEquipped(avatarId);
      onEquip();
    } catch (err: any) {
      alert(err.message);
    }
  };

  const cultures = ["all", ...new Set(avatars.map((a) => a.culture))];
  const filtered = filter === "all" ? avatars : avatars.filter((a) => a.culture === filter);

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={panelStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ color: "#ffd700", margin: 0 }}>🎭 Seleccionar Avatar</h2>
        <p style={{ color: "#aaa", fontSize: 12, margin: "4px 0 0" }}>Elige tu personaje según la cultura comercial que prefieras</p>

        {/* Culture filter */}
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 8 }}>
          {cultures.map((c) => {
            const config = CULTURE_CONFIG[c];
            return (
              <button
                key={c}
                onClick={() => setFilter(c)}
                style={{
                  padding: "4px 10px",
                  borderRadius: 12,
                  border: filter === c ? `2px solid ${config?.color || "#888"}` : "1px solid #333",
                  background: filter === c ? (config?.bg || "#222") : "#111",
                  color: config?.color || "#888",
                  fontSize: 11,
                  cursor: "pointer",
                }}
              >
                {config?.emoji || "🌍"} {config?.name || c}
              </button>
            );
          })}
        </div>

        {/* Avatar grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 8, maxHeight: 380, overflowY: "auto", marginTop: 8 }}>
          {filtered.map((avatar) => {
            const culture = CULTURE_CONFIG[avatar.culture];
            const unlocked = userLevel >= avatar.unlockLevel;
            const canAfford = userGold >= avatar.price;
            const isEquipped = equipped === avatar.id;

            return (
              <div
                key={avatar.id}
                style={{
                  background: isEquipped ? "#1a2a1a" : "#151520",
                  border: `2px solid ${isEquipped ? "#4f8" : unlocked ? (culture?.color || "#444") : "#333"}`,
                  borderRadius: 8,
                  padding: 10,
                  opacity: unlocked ? 1 : 0.4,
                  cursor: unlocked ? "pointer" : "not-allowed",
                }}
                onClick={() => unlocked && setSelected(avatar.id)}
              >
                <div style={{ fontSize: 36, textAlign: "center" }}>{avatar.emoji}</div>
                <div style={{ fontSize: 12, fontWeight: "bold", color: culture?.color || "#ddd", textAlign: "center", marginTop: 4 }}>
                  {avatar.name}
                </div>
                <div style={{ fontSize: 10, color: "#888", textAlign: "center" }}>{avatar.description}</div>
                {avatar.accessory && (
                  <div style={{ fontSize: 10, color: "#aaa", textAlign: "center", marginTop: 2 }}>🔧 {avatar.accessory}</div>
                )}
                {!unlocked && (
                  <div style={{ fontSize: 10, color: "#f66", textAlign: "center", marginTop: 4 }}>🔒 Nivel {avatar.unlockLevel}</div>
                )}
                {unlocked && avatar.price > 0 && !isEquipped && (
                  <div style={{ fontSize: 10, color: canAfford ? "#ffd700" : "#f66", textAlign: "center", marginTop: 4 }}>
                    💰 {avatar.price} oro
                  </div>
                )}
                {isEquipped && (
                  <div style={{ fontSize: 10, color: "#4f8", textAlign: "center", marginTop: 4 }}>✅ Equipado</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action buttons */}
        <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
          {selected && selected !== equipped && (
            <button
              onClick={() => handleEquip(selected)}
              style={{ ...btnStyle, background: "#4a7c59" }}
            >
              Equipar Avatar
            </button>
          )}
          <button onClick={onClose} style={{ ...btnStyle, background: "#555" }}>Cerrar</button>
        </div>
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = { position: "fixed", inset: 0, background: "#00000088", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const panelStyle: React.CSSProperties = { background: "#1a1a2e", border: "2px solid #444", borderRadius: 12, padding: 20, minWidth: 520, maxWidth: 700, maxHeight: "85vh", display: "flex", flexDirection: "column", gap: 8 };
const btnStyle: React.CSSProperties = { padding: "10px 16px", borderRadius: 6, border: "none", color: "#fff", fontSize: 14, cursor: "pointer", flex: 1 };
