import { useState, useRef, useEffect, useCallback } from "react";
import type { Zone, Waypoint, NPC } from "../types";

interface GameMapProps {
  zones: Zone[];
  currentZone: Zone | null;
  onZoneSelect: (zone: Zone) => void;
  onWaypointClick: (waypoint: Waypoint) => void;
  onNPCClick: (npc: NPC) => void;
  playerLevel: number;
}

const TILE_SIZE = 48;
const MAP_WIDTH = 2400;
const MAP_HEIGHT = 1600;

const ZONE_COLORS: Record<string, string> = {
  "Village Market": "#4a7c59",
  "Forest Outpost": "#2d5a27",
  "Mountain Pass": "#8b7355",
  "Desert Oasis": "#c2a645",
  "Harbor Town": "#3a6b8c",
  "Pirate Cove": "#5c3a6b",
  "Royal Capital": "#8c6b3a",
  "Dragon's Lair": "#6b3a3a",
  "Sky Islands": "#6b8c9a",
  "Realm of Legends": "#9a6b8c",
};

const WAYPOINT_ICONS: Record<string, string> = {
  trade_post: "🏪",
  auction_house: "🏛️",
  portal: "🌀",
  treasure: "💎",
};

const NPC_ICONS: Record<string, string> = {
  merchant: "🧳",
  quest_giving: "📜",
  blacksmith: "⚒️",
  banker: "🏦",
};

export default function GameMap({ zones, currentZone, onZoneSelect, onWaypointClick, onNPCClick, playerLevel }: GameMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setDragging(true);
    setDragStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
  }, [offset]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!dragging) return;
    setOffset({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
  }, [dragging, dragStart]);

  const handleMouseUp = useCallback(() => setDragging(false), []);

  useEffect(() => {
    if (currentZone && containerRef.current) {
      const container = containerRef.current;
      const rect = container.getBoundingClientRect();
      setOffset({
        x: rect.width / 2 - currentZone.mapX - currentZone.width / 2,
        y: rect.height / 2 - currentZone.mapY - currentZone.height / 2,
      });
    }
  }, [currentZone]);

  return (
    <div
      ref={containerRef}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{
        width: "100%",
        height: "500px",
        overflow: "hidden",
        position: "relative",
        background: "#1a1a2e",
        borderRadius: "8px",
        cursor: dragging ? "grabbing" : "grab",
        userSelect: "none",
      }}
    >
      <div
        style={{
          position: "absolute",
          transform: `translate(${offset.x}px, ${offset.y}px)`,
          width: MAP_WIDTH,
          height: MAP_HEIGHT,
        }}
      >
        {/* Grid lines */}
        <svg width={MAP_WIDTH} height={MAP_HEIGHT} style={{ position: "absolute", top: 0, left: 0 }}>
          {Array.from({ length: Math.floor(MAP_WIDTH / TILE_SIZE) + 1 }).map((_, i) => (
            <line key={`v${i}`} x1={i * TILE_SIZE} y1={0} x2={i * TILE_SIZE} y2={MAP_HEIGHT} stroke="#ffffff08" strokeWidth={1} />
          ))}
          {Array.from({ length: Math.floor(MAP_HEIGHT / TILE_SIZE) + 1 }).map((_, i) => (
            <line key={`h${i}`} x1={0} y1={i * TILE_SIZE} x2={MAP_WIDTH} y2={i * TILE_SIZE} stroke="#ffffff08" strokeWidth={1} />
          ))}
        </svg>

        {/* Zones */}
        {zones.map((zone) => {
          const unlocked = playerLevel >= zone.requiredLevel;
          const isCurrent = currentZone?.id === zone.id;
          return (
            <div
              key={zone.id}
              onClick={(e) => {
                e.stopPropagation();
                if (unlocked) onZoneSelect(zone);
              }}
              style={{
                position: "absolute",
                left: zone.mapX,
                top: zone.mapY,
                width: zone.width,
                height: zone.height,
                background: unlocked ? ZONE_COLORS[zone.name] || "#444" : "#333",
                opacity: unlocked ? (isCurrent ? 1 : 0.7) : 0.3,
                border: isCurrent ? "3px solid #ffd700" : "2px solid #ffffff20",
                borderRadius: "8px",
                cursor: unlocked ? "pointer" : "not-allowed",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
              }}
            >
              <span style={{ color: "#fff", fontWeight: "bold", fontSize: "13px", textShadow: "0 1px 3px #000" }}>
                {zone.name}
              </span>
              {!unlocked && (
                <span style={{ color: "#ff6b6b", fontSize: "11px", marginTop: 4 }}>
                  🔒 Nivel {zone.requiredLevel}
                </span>
              )}

              {/* Waypoints */}
              {unlocked &&
                zone.waypoints.map((wp) => (
                  <div
                    key={wp.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onWaypointClick(wp);
                    }}
                    title={wp.name}
                    style={{
                      position: "absolute",
                      left: wp.x,
                      top: wp.y,
                      fontSize: "20px",
                      cursor: "pointer",
                      filter: "drop-shadow(0 0 4px #000)",
                    }}
                  >
                    {WAYPOINT_ICONS[wp.type] || "📍"}
                  </div>
                ))}

              {/* NPCs */}
              {unlocked &&
                zone.npcs.map((npc, i) => (
                  <div
                    key={npc.id}
                    onClick={(e) => {
                      e.stopPropagation();
                      onNPCClick(npc);
                    }}
                    title={`${npc.name} - ${npc.role}`}
                    style={{
                      position: "absolute",
                      left: 20 + i * 30,
                      bottom: 8,
                      fontSize: "18px",
                      cursor: "pointer",
                      filter: "drop-shadow(0 0 4px #000)",
                    }}
                  >
                    {NPC_ICONS[npc.role] || "👤"}
                  </div>
                ))}
            </div>
          );
        })}
      </div>

      {/* Mini controls */}
      <div style={{ position: "absolute", bottom: 8, right: 8, display: "flex", gap: 4 }}>
        <button
          onClick={() => setOffset((o) => ({ x: o.x + 100, y: o.y + 100 }))}
          style={controlBtnStyle}
        >
          ⬆
        </button>
        <button
          onClick={() => setOffset((o) => ({ x: o.x - 100, y: o.y - 100 }))}
          style={controlBtnStyle}
        >
          ⬇
        </button>
      </div>

      {/* Legend */}
      <div style={{ position: "absolute", top: 8, left: 8, background: "#00000088", padding: "6px 10px", borderRadius: 6, fontSize: 11, color: "#ccc" }}>
        <div>🏪 Comercio | 🏛️ Subasta | 🌀 Portal | 💎 Tesoro</div>
        <div>🧳 Mercader | ⚒️ Herrero | 📜 Misiones | 🏦 Banquero</div>
      </div>
    </div>
  );
}

const controlBtnStyle: React.CSSProperties = {
  width: 28,
  height: 28,
  border: "none",
  borderRadius: 4,
  background: "#ffffff22",
  color: "#fff",
  cursor: "pointer",
  fontSize: 14,
};
