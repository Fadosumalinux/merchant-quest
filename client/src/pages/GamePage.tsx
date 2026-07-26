import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../utils/api";
import GameMap from "../components/GameMap";
import PlayerHUD from "../components/PlayerHUD";
import TradeModal from "../components/TradeModal";
import TokenVerifier from "../components/TokenVerifier";
import type { Zone, NPC, Waypoint } from "../types";

export default function GamePage() {
  const { user, logout, refreshUser } = useAuth();
  const [zones, setZones] = useState<Zone[]>([]);
  const [currentZone, setCurrentZone] = useState<Zone | null>(null);
  const [activeNPC, setActiveNPC] = useState<NPC | null>(null);
  const [activeWaypoint, setActiveWaypoint] = useState<Waypoint | null>(null);
  const [showVerifier, setShowVerifier] = useState(false);

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

  if (!user) return null;

  return (
    <div style={containerStyle}>
      <header style={headerStyle}>
        <h1 style={{ color: "#ffd700", margin: 0, fontSize: 22 }}>⚔️ Merchant Quest</h1>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <button onClick={() => setShowVerifier(true)} style={navBtnStyle}>🔍 Verificar Token</button>
          <button onClick={refreshUser} style={navBtnStyle}>🔄</button>
          <button onClick={logout} style={{ ...navBtnStyle, background: "#6b3a3a" }}>Salir</button>
        </div>
      </header>

      <div style={mainStyle}>
        <aside style={{ width: 260, flexShrink: 0 }}>
          <PlayerHUD user={user} />
        </aside>

        <main style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
          <GameMap
            zones={zones}
            currentZone={currentZone}
            onZoneSelect={handleZoneSelect}
            onWaypointClick={setActiveWaypoint}
            onNPCClick={setActiveNPC}
            playerLevel={user.level}
          />

          {currentZone && (
            <div style={zoneInfoStyle}>
              <h2 style={{ color: "#ffd700", margin: 0 }}>{currentZone.name}</h2>
              <p style={{ color: "#aaa", margin: "4px 0" }}>{currentZone.description}</p>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                {currentZone.waypoints.map((wp) => (
                  <div key={wp.id} style={waypointTagStyle} onClick={() => setActiveWaypoint(wp)}>
                    {wp.name}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>
      </div>

      {activeNPC && (
        <TradeModal
          npcName={activeNPC.name}
          zoneId={currentZone?.id || ""}
          onClose={() => setActiveNPC(null)}
        />
      )}

      {showVerifier && <TokenVerifier onClose={() => setShowVerifier(false)} />}
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
  padding: "12px 20px",
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
  padding: "6px 12px",
  borderRadius: 6,
  border: "none",
  background: "#333",
  color: "#ddd",
  fontSize: 13,
  cursor: "pointer",
};

const zoneInfoStyle: React.CSSProperties = {
  background: "#1a1a2e",
  border: "1px solid #333",
  borderRadius: 8,
  padding: 16,
};

const waypointTagStyle: React.CSSProperties = {
  padding: "4px 10px",
  borderRadius: 12,
  background: "#333",
  color: "#ddd",
  fontSize: 12,
  cursor: "pointer",
};
