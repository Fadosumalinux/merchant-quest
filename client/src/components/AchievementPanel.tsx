import { useState, useEffect } from "react";
import { api } from "../utils/api";
import type { Achievement, UserAchievement } from "../types";
import { TIER_CONFIG } from "../types";

interface AchievementPanelProps {
  onClose: () => void;
}

export default function AchievementPanel({ onClose }: AchievementPanelProps) {
  const [allAchievements, setAll] = useState<Achievement[]>([]);
  const [earned, setEarned] = useState<UserAchievement[]>([]);
  const [stats, setStats] = useState({ total: 0, earned: 0, totalXp: 0, percentage: 0 });
  const [activeQuiz, setActiveQuiz] = useState<Achievement | null>(null);
  const [quizAnswer, setQuizAnswer] = useState("");
  const [quizResult, setQuizResult] = useState<any>(null);

  useEffect(() => {
    Promise.all([
      api.achievements.list(),
      api.achievements.mine(),
      api.achievements.stats(),
    ]).then(([all, mine, s]) => {
      setAll(all);
      setEarned(mine);
      setStats(s);
    });
  }, []);

  const earnedIds = new Set(earned.map((e) => e.achievementId));

  const handleQuiz = async () => {
    if (!activeQuiz) return;
    try {
      const result = await api.achievements.quiz(activeQuiz.id, quizAnswer);
      setQuizResult(result);
      if (result.passed) {
        const [mine, s] = await Promise.all([api.achievements.mine(), api.achievements.stats()]);
        setEarned(mine);
        setStats(s);
      }
    } catch (err: any) {
      setQuizResult({ passed: false, message: err.message });
    }
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={panelStyle} onClick={(e) => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ color: "#ffd700", margin: 0 }}>🏆 Insignias y Logros</h2>
          <button onClick={onClose} style={closeBtn}>✕</button>
        </div>

        {/* Stats */}
        <div style={statsBar}>
          <span>⭐ {stats.earned}/{stats.total} logros</span>
          <span>📊 {stats.percentage}% completado</span>
          <span>✨ +{stats.totalXp} XP total</span>
        </div>

        {/* Achievement grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 8, maxHeight: 400, overflowY: "auto" }}>
          {allAchievements.map((ach) => {
            const isEarned = earnedIds.has(ach.id);
            const tier = TIER_CONFIG[ach.tier] || TIER_CONFIG.bronze;
            return (
              <div
                key={ach.id}
                onClick={() => !isEarned && ach.quizQuestion && setActiveQuiz(ach)}
                style={{
                  background: isEarned ? "#1a2a1a" : "#151520",
                  border: `2px solid ${isEarned ? tier.color : "#333"}`,
                  borderRadius: 8,
                  padding: 10,
                  opacity: isEarned ? 1 : 0.6,
                  cursor: !isEarned && ach.quizQuestion ? "pointer" : "default",
                  transition: "all 0.2s",
                }}
              >
                <div style={{ fontSize: 28, textAlign: "center" }}>{ach.badgeEmoji}</div>
                <div style={{ fontSize: 12, fontWeight: "bold", color: tier.color, textAlign: "center", marginTop: 4 }}>
                  {ach.name}
                </div>
                <div style={{ fontSize: 10, color: "#888", textAlign: "center", marginTop: 2 }}>
                  {ach.description}
                </div>
                {isEarned ? (
                  <div style={{ fontSize: 10, color: "#4f8", textAlign: "center", marginTop: 4 }}>✅ Obtenida</div>
                ) : ach.quizQuestion ? (
                  <div style={{ fontSize: 10, color: "#ffd700", textAlign: "center", marginTop: 4 }}>📝 Responder quiz</div>
                ) : null}
                <div style={{ fontSize: 9, color: "#666", textAlign: "center", marginTop: 2 }}>
                  +{ach.xpReward} XP | +{ach.goldReward} 🪙
                </div>
              </div>
            );
          })}
        </div>

        {/* Quiz modal */}
        {activeQuiz && (
          <div style={quizOverlay} onClick={() => { setActiveQuiz(null); setQuizResult(null); setQuizAnswer(""); }}>
            <div style={quizBox} onClick={(e) => e.stopPropagation()}>
              <h3 style={{ color: "#ffd700", margin: 0 }}>{activeQuiz.badgeEmoji} {activeQuiz.name}</h3>
              <p style={{ color: "#aaa", fontSize: 13, marginTop: 8 }}>{activeQuiz.description}</p>
              {activeQuiz.lessonText && (
                <div style={{ background: "#1a2a1a", padding: 10, borderRadius: 6, fontSize: 12, color: "#8f8", marginTop: 8 }}>
                  📜 {activeQuiz.lessonText}
                </div>
              )}
              {quizResult ? (
                <div style={{ marginTop: 12, textAlign: "center" }}>
                  <div style={{ fontSize: 24 }}>{quizResult.passed ? "🎉" : "❌"}</div>
                  <div style={{ color: quizResult.passed ? "#4f8" : "#f66", fontWeight: "bold", marginTop: 8 }}>
                    {quizResult.message}
                  </div>
                  {quizResult.passed && quizResult.lessonText && (
                    <div style={{ background: "#111", padding: 10, borderRadius: 6, fontSize: 12, color: "#ffd700", marginTop: 8 }}>
                      📜 {quizResult.lessonText}
                    </div>
                  )}
                  {quizResult.passed && (
                    <div style={{ marginTop: 8, fontSize: 13, color: "#ffd700" }}>
                      +{activeQuiz.xpReward} XP | +{activeQuiz.goldReward} 🪙
                    </div>
                  )}
                  <button onClick={() => { setActiveQuiz(null); setQuizResult(null); setQuizAnswer(""); }} style={{ ...quizBtn, marginTop: 12 }}>Cerrar</button>
                </div>
              ) : (
                <div style={{ marginTop: 12 }}>
                  <div style={{ color: "#ddd", fontSize: 14, marginBottom: 8 }}>❓ {activeQuiz.quizQuestion}</div>
                  <input
                    value={quizAnswer}
                    onChange={(e) => setQuizAnswer(e.target.value)}
                    placeholder="Tu respuesta..."
                    style={quizInput}
                    onKeyDown={(e) => e.key === "Enter" && handleQuiz()}
                  />
                  <button onClick={handleQuiz} style={quizBtn}>Enviar</button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = { position: "fixed", inset: 0, background: "#00000088", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const panelStyle: React.CSSProperties = { background: "#1a1a2e", border: "2px solid #444", borderRadius: 12, padding: 20, minWidth: 500, maxWidth: 700, maxHeight: "85vh", display: "flex", flexDirection: "column", gap: 12 };
const statsBar: React.CSSProperties = { display: "flex", gap: 16, fontSize: 12, color: "#aaa", padding: "8px 0", borderBottom: "1px solid #333" };
const closeBtn: React.CSSProperties = { background: "none", border: "none", color: "#888", fontSize: 18, cursor: "pointer" };
const quizOverlay: React.CSSProperties = { position: "fixed", inset: 0, background: "#000000aa", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 2000 };
const quizBox: React.CSSProperties = { background: "#1a1a2e", border: "2px solid #ffd700", borderRadius: 12, padding: 24, minWidth: 380 };
const quizInput: React.CSSProperties = { width: "100%", padding: "10px 12px", borderRadius: 6, border: "1px solid #444", background: "#111", color: "#eee", fontSize: 14, marginBottom: 8 };
const quizBtn: React.CSSProperties = { padding: "10px 20px", borderRadius: 6, border: "none", background: "#4a7c59", color: "#fff", fontSize: 14, cursor: "pointer", width: "100%" };
