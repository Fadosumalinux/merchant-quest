import { useState } from "react";
import { api } from "../utils/api";
import { useAuth } from "../context/AuthContext";

export default function TradeModal({
  npcName,
  zoneId,
  onClose,
}: {
  npcName: string;
  zoneId: string;
  onClose: () => void;
}) {
  const { user, refreshUser } = useAuth();
  const [targetUsername, setTargetUsername] = useState("");
  const [itemId, setItemId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const handleTrade = async () => {
    try {
      setError("");
      const trade = await api.trades.create({
        toUserId: targetUsername,
        itemId,
        quantity,
        zoneId,
      });
      setResult(trade);
      await refreshUser();
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (result) {
    return (
      <div style={overlayStyle} onClick={onClose}>
        <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
          <h3 style={{ color: "#4f8", margin: 0 }}>✅ Transacción Completada</h3>
          <div style={{ marginTop: 12, fontSize: 14, color: "#ccc" }}>
            <p>Token de validación:</p>
            <code style={{ background: "#111", padding: "4px 8px", borderRadius: 4, fontSize: 11, wordBreak: "break-all" }}>
              {result.token}
            </code>
            <p style={{ color: "#ffd700", marginTop: 8 }}>+{result.xpGained} XP ganado</p>
            {result.newLevel > (user?.level || 0) && (
              <p style={{ color: "#ff6b6b", fontWeight: "bold" }}>🎉 ¡Subiste al nivel {result.newLevel}!</p>
            )}
          </div>
          <button onClick={onClose} style={btnStyle}>Cerrar</button>
        </div>
      </div>
    );
  }

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ color: "#ffd700", margin: 0 }}>🏪 Comercio con {npcName}</h3>
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            placeholder="ID del usuario destino"
            value={targetUsername}
            onChange={(e) => setTargetUsername(e.target.value)}
            style={inputStyle}
          />
          <input
            placeholder="ID del item"
            value={itemId}
            onChange={(e) => setItemId(e.target.value)}
            style={inputStyle}
          />
          <input
            type="number"
            min={1}
            placeholder="Cantidad"
            value={quantity}
            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
            style={inputStyle}
          />
          {error && <div style={{ color: "#f66", fontSize: 13 }}>{error}</div>}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={handleTrade} style={{ ...btnStyle, background: "#4a7c59" }}>Confirmar</button>
            <button onClick={onClose} style={{ ...btnStyle, background: "#555" }}>Cancelar</button>
          </div>
        </div>
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: "fixed",
  inset: 0,
  background: "#00000088",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalStyle: React.CSSProperties = {
  background: "#1a1a2e",
  border: "2px solid #444",
  borderRadius: 12,
  padding: 24,
  minWidth: 360,
  maxWidth: 480,
};

const inputStyle: React.CSSProperties = {
  padding: "8px 12px",
  borderRadius: 6,
  border: "1px solid #444",
  background: "#111",
  color: "#eee",
  fontSize: 14,
};

const btnStyle: React.CSSProperties = {
  padding: "8px 16px",
  borderRadius: 6,
  border: "none",
  color: "#fff",
  fontSize: 14,
  cursor: "pointer",
  flex: 1,
};
