import { useState, useEffect } from "react";
import { api } from "../utils/api";
import type { Item } from "../types";
import { CULTURE_CONFIG } from "../types";

interface ItemCatalogProps {
  culture?: string;
  onClose: () => void;
}

const RARITY_COLORS: Record<string, string> = {
  common: "#aaa",
  uncommon: "#4a9",
  rare: "#48f",
  epic: "#a4f",
  legendary: "#fa0",
};

export default function ItemCatalog({ culture, onClose }: ItemCatalogProps) {
  const [items, setItems] = useState<Item[]>([]);
  const [filter, setFilter] = useState(culture || "all");

  useEffect(() => {
    api.inventory.list().then((inv) => {
      setItems(inv.map((i: any) => i.item));
    });
  }, []);

  const cultures = ["all", ...new Set(items.map((i) => i.culture).filter(Boolean))];
  const filtered = filter === "all" ? items : items.filter((i) => i.culture === filter);

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={panelStyle} onClick={(e) => e.stopPropagation()}>
        <h2 style={{ color: "#ffd700", margin: 0 }}>📦 Catálogo de Productos</h2>

        <div style={{ display: "flex", gap: 4, flexWrap: "wrap", marginTop: 8 }}>
          {cultures.map((c) => {
            const config = CULTURE_CONFIG[c || ""];
            return (
              <button
                key={c}
                onClick={() => setFilter(c || "all")}
                style={{
                  padding: "3px 8px",
                  borderRadius: 10,
                  border: filter === c ? `2px solid ${config?.color || "#888"}` : "1px solid #333",
                  background: filter === c ? (config?.bg || "#222") : "#111",
                  color: config?.color || "#888",
                  fontSize: 10,
                  cursor: "pointer",
                }}
              >
                {config?.emoji || "📦"} {config?.name || c}
              </button>
            );
          })}
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 6, maxHeight: 400, overflowY: "auto", marginTop: 8 }}>
          {filtered.map((item) => {
            const rarityColor = RARITY_COLORS[item.rarity] || "#aaa";
            return (
              <div key={item.id} style={{
                background: "#151520",
                border: `1px solid ${rarityColor}33`,
                borderRadius: 6,
                padding: 8,
              }}>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 24 }}>{item.emoji}</span>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: "bold", color: rarityColor }}>{item.name}</div>
                    <div style={{ fontSize: 10, color: "#888" }}>{item.description}</div>
                  </div>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4, fontSize: 10, color: "#666" }}>
                  <span style={{ color: rarityColor, textTransform: "capitalize" }}>{item.rarity}</span>
                  <span>💰 {item.basePrice}</span>
                </div>
                {item.culture && (
                  <div style={{ fontSize: 9, color: CULTURE_CONFIG[item.culture]?.color || "#666", marginTop: 2 }}>
                    {CULTURE_CONFIG[item.culture]?.emoji} {CULTURE_CONFIG[item.culture]?.name}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <button onClick={onClose} style={{ ...btnStyle, background: "#555", marginTop: 8 }}>Cerrar</button>
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = { position: "fixed", inset: 0, background: "#00000088", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 };
const panelStyle: React.CSSProperties = { background: "#1a1a2e", border: "2px solid #444", borderRadius: 12, padding: 20, minWidth: 500, maxWidth: 650, maxHeight: "85vh", display: "flex", flexDirection: "column", gap: 4 };
const btnStyle: React.CSSProperties = { padding: "10px 16px", borderRadius: 6, border: "none", color: "#fff", fontSize: 14, cursor: "pointer" };
