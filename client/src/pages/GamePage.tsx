import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";
import GameMap from "../components/GameMap";
import PlayerHUD from "../components/PlayerHUD";
import TradeModal from "../components/TradeModal";
import TokenVerifier from "../components/TokenVerifier";
import AchievementPanel from "../components/AchievementPanel";
import AvatarSelector from "../components/AvatarSelector";
import NPCDialog from "../components/NPCDialog";
import BadgeShowcase from "../components/BadgeShowcase";
import ItemCatalog from "../components/ItemCatalog";
import type { Zone, NPC, Achievement } from "../types";
import { CULTURE_CONFIG } from "../types";

export default function GamePage() {
  const { user, logout, refreshUser } = useAuth();
  const [zones, setZones] = useState<Zone[]>([]);
  const [currentZone, setCurrentZone] = useState<Zone | null>(null);
  const [activeNPC, setActiveNPC] = useState<NPC | null>(null);
  const [showVerifier, setShowVerifier] = useState(false);
  const [showAchievements, setShowAchievements] = useState(false);
  const [showAvatars, setShowAvatars] = useState(false);
  const [showCatalog, setShowCatalog] = useState(false);
  const [tradingNPC, setTradingNPC] = useState<NPC | null>(null);
  const [, setLessonAchievement] = useState<Achievement | null>(null);

  useEffect(() => {
    api.zones.list().then(setZones).catch(console.error);
  }, []);

  const handleZoneSelect = async (zone: Zone) => {
    try {
      await api.zones.travel(zone.id);
      setCurrentZone(zone);
    } catch (err: any) {
      alert(err.message);
    }
  };

  const handleNPCClick = (npc: NPC) => {
    setActiveNPC(npc);
  };

  if (!user) return null;

  const cultureConfig = currentZone ? CULTURE_CONFIG[currentZone.culture] : null;

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <h1 style={{ color: "#ffd700", margin: 0, fontSize: 20 }}>⚔️ Merchant Quest</h1>
          {currentZone && cultureConfig && (
            <span style={{ fontSize: 12, color: cultureConfig.color, background: cultureConfig.bg, padding: "3px 8px", borderRadius: 10 }}>
              {cultureConfig.emoji} {currentZone.name}
            </span>
          )}
        </div>
        <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
          <button onClick={() => setShowAchievements(true)} style={navBtnStyle}>🏆 Insignias</button>
          <button onClick={() => setShowAvatars(true)} style={navBtnStyle}>🎭 Avatar</button>
          <button onClick={() => setShowCatalog(true)} style={navBtnStyle}>📦 Items</button>
          <button onClick={() => setShowVerifier(true)} style={navBtnStyle}>🔍 Token</button>
          <button onClick={refreshUser} style={navBtnStyle}>🔄</button>
          <button onClick={logout} style={{ ...navBtnStyle, background: "#6b3a3a" }}>Salir</button>
        </div>
      </header>

      <div style={mainStyle}>
        <aside style={{ width: 260, flexShrink: 0, display: "flex", flexDirection: "column", gap: 10 }}>
          <PlayerHUD user={user} />
          <BadgeShowcase />
        </aside>

        <main style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
          <GameMap
            zones={zones}
            currentZone={currentZone}
            onZoneSelect={handleZoneSelect}
            onWaypointClick={() => {}}
            onNPCClick={handleNPCClick}
            playerLevel={user.level}
          />

          {currentZone && (
            <div style={zoneInfoStyle}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <h2 style={{ color: "#ffd700", margin: 0, fontSize: 18 }}>{currentZone.name}</h2>
                  <p style={{ color: "#aaa", margin: "4px 0", fontSize: 13 }}>{currentZone.description}</p>
                </div>
                {cultureConfig && (
                  <div style={{
                    padding: "8px 14px",
                    borderRadius: 8,
                    background: cultureConfig.bg,
                    border: `1px solid ${cultureConfig.color}`,
                    textAlign: "center",
                  }}>
                    <div style={{ fontSize: 28 }}>{cultureConfig.emoji}</div>
                    <div style={{ fontSize: 11, color: cultureConfig.color }}>{cultureConfig.name}</div>
                  </div>
                )}
              </div>

              {/* NPCs in zone */}
              {currentZone.npcs.length > 0 && (
                <div style={{ marginTop: 12 }}>
                  <div style={{ fontSize: 12, fontWeight: "bold", color: "#888", marginBottom: 6 }}>Personajes en esta zona:</div>
                  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                    {currentZone.npcs.map((npc) => {
                      const npcCulture = CULTURE_CONFIG[npc.culture] || CULTURE_CONFIG.universal;
                      return (
                        <div
                          key={npc.id}
                          onClick={() => handleNPCClick(npc)}
                          style={{
                            background: npcCulture.bg,
                            border: `1px solid ${npcCulture.color}`,
                            borderRadius: 8,
                            padding: "8px 12px",
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                            transition: "all 0.2s",
                          }}
                        >
                          <span style={{ fontSize: 24 }}>{npc.avatarEmoji}</span>
                          <div>
                            <div style={{ fontSize: 12, fontWeight: "bold", color: npcCulture.color }}>{npc.name}</div>
                            <div style={{ fontSize: 10, color: "#888" }}>
                              {npcCulture.emoji} {npc.role.replace("_", " ")}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* NPC Dialog */}
      {activeNPC && (
        <NPCDialog
          npc={activeNPC}
          onTrade={() => { setTradingNPC(activeNPC); setActiveNPC(null); }}
          onLesson={(ach) => { setLessonAchievement(ach); setActiveNPC(null); setShowAchievements(true); }}
          onClose={() => setActiveNPC(null)}
        />
      )}

      {/* Trade Modal */}
      {tradingNPC && (
        <TradeModal
          npcName={tradingNPC.name}
          zoneId={currentZone?.id || ""}
          onClose={() => setTradingNPC(null)}
        />
      )}

      {/* Panels */}
      {showVerifier && <TokenVerifier onClose={() => setShowVerifier(false)} />}
      {showAchievements && <AchievementPanel onClose={() => setShowAchievements(false)} />}
      {showAvatars && (
        <AvatarSelector
          userLevel={user.level}
          userGold={user.gold}
          onClose={() => setShowAvatars(false)}
          onEquip={refreshUser}
        />
      )}
      {showCatalog && <ItemCatalog onClose={() => setShowCatalog(false)} />}
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  background: "#0a0a1a",
  display: "flex",
  flexDirection: "column",
};

const headerStyle: React.CSSProperties = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  padding: "10px 20px",
  background: "#111122",
  borderBottom: "1px solid #333",
};

const mainStyle: React.CSSProperties = {
  display: "flex",
  gap: 16,
  padding: 16,
  flex: 1,
};

const navBtnStyle: React.CSSProperties = {
  padding: "5px 10px",
  borderRadius: 6,
  border: "none",
  background: "#333",
  color: "#ddd",
  fontSize: 12,
  cursor: "pointer",
};

const zoneInfoStyle: React.CSSProperties = {
  background: "#1a1a2e",
  border: "1px solid #333",
  borderRadius: 8,
  padding: 16,
};
