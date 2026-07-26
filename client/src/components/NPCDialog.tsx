import { useState } from "react";
import type { NPC, Achievement } from "../types";
import { CULTURE_CONFIG } from "../types";

interface NPCDialogProps {
  npc: NPC;
  onTrade: () => void;
  onLesson?: (achievement: Achievement) => void;
  onClose: () => void;
}

export default function NPCDialog({ npc, onTrade, onLesson, onClose }: NPCDialogProps) {
  const [showingLesson, setShowingLesson] = useState(false);
  const culture = CULTURE_CONFIG[npc.culture] || CULTURE_CONFIG.universal;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={{ ...dialogStyle, borderColor: culture.color }} onClick={(e) => e.stopPropagation()}>
        {/* NPC Header */}
        <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
          <div style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            background: culture.bg,
            border: `3px solid ${culture.color}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 32,
          }}>
            {npc.avatarEmoji}
          </div>
          <div>
            <div style={{ color: culture.color, fontWeight: "bold", fontSize: 16 }}>{npc.name}</div>
            <div style={{ color: "#888", fontSize: 11 }}>
              {culture.emoji} {culture.name} • {npc.personality}
            </div>
            <div style={{ color: "#666", fontSize: 11, textTransform: "capitalize" }}>
              Rol: {npc.role.replace("_", " ")}
            </div>
          </div>
        </div>

        {/* Dialog bubble */}
        <div style={{
          background: "#111",
          borderRadius: 8,
          padding: 12,
          borderLeft: `3px solid ${culture.color}`,
          color: "#ddd",
          fontSize: 13,
          lineHeight: 1.5,
          marginBottom: 12,
        }}>
          "{npc.dialog}"
        </div>

        {/* NPC Info */}
        {npc.tradeBonus > 0 && (
          <div style={{ fontSize: 11, color: "#4f8", marginBottom: 8 }}>
            📈 Bonus de reputación: +{npc.tradeBonus} por comerciar conmigo
          </div>
        )}

        {npc.teachesBadge && (
          <div style={{ fontSize: 11, color: "#ffd700", marginBottom: 8 }}>
            🏆 Puedo otorgarte una insignia si demuestras lo aprendido
          </div>
        )}

        {/* Actions */}
        <div style={{ display: "flex", gap: 8 }}>
          <button
            onClick={onTrade}
            style={{ ...actionBtn, background: culture.color }}
          >
            🤝 Comerciar
          </button>
          {npc.teachesBadge && (
            <button
              onClick={() => setShowingLesson(true)}
              style={{ ...actionBtn, background: "#4a7c59" }}
            >
              📚 Aprender Lección
            </button>
          )}
          <button onClick={onClose} style={{ ...actionBtn, background: "#555" }}>
            Salir
          </button>
        </div>

        {/* Lesson overlay */}
        {showingLesson && (
          <div style={lessonOverlay} onClick={() => setShowingLesson(false)}>
            <div style={lessonBox} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ color: "#ffd700", margin: 0 }}>📜 Lección del {npc.name}</h3>
              <div style={{ marginTop: 12, fontSize: 13, color: "#ccc", lineHeight: 1.6 }}>
                <p>Para ganar la insignia <strong>{npc.teachesBadge}</strong>, necesitas demostrar que comprendiste la lección.</p>
                <div style={{ background: "#111", padding: 12, borderRadius: 6, marginTop: 8, fontSize: 12, color: "#8f8" }}>
                  💡 Cada cultura tiene su propia filosofía del comercio. Escucha, aprende y practica.
                </div>
              </div>
              <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
                <button
                  onClick={() => {
                    if (npc.teachesBadge && onLesson) {
                      // Fetch the achievement and open quiz
                      fetch(`/api/achievements/${npc.teachesBadge}`)
                        .then((r) => r.json())
                        .then((ach) => onLesson(ach));
                    }
                    setShowingLesson(false);
                  }}
                  style={{ ...actionBtn, background: "#4a7c59", flex: 1 }}
                >
                  Responder Quiz
                </button>
                <button onClick={() => setShowingLesson(false)} style={{ ...actionBtn, background: "#555", flex: 1 }}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = { position: "fixed", inset: 0, background: "#00000088", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const dialogStyle: React.CSSProperties = { background: "#1a1a2e", border: "2px solid #444", borderRadius: 12, padding: 20, minWidth: 380, maxWidth: 480 };
const actionBtn: React.CSSProperties = { padding: "8px 14px", borderRadius: 6, border: "none", color: "#fff", fontSize: 13, cursor: "pointer", flex: 1 };
const lessonOverlay: React.CSSProperties = { position: "fixed", inset: 0, background: "#000000aa", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 };
const lessonBox: React.CSSProperties = { background: "#1a1a2e", border: "2px solid #ffd700", borderRadius: 12, padding: 24, minWidth: 380 };
