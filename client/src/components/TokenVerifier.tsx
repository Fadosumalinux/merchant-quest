import { useState } from "react";
import { api } from "../utils/api";

export default function TokenVerifier({ onClose }: { onClose: () => void }) {
  const [hash, setHash] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState("");

  const verify = async () => {
    try {
      setError("");
      const data = await api.trades.verify(hash);
      setResult(data);
    } catch (err: any) {
      setError(err.message);
      setResult(null);
    }
  };

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <h3 style={{ color: "#48f", margin: 0 }}>🔍 Verificar Token</h3>
        <div style={{ marginTop: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          <input
            placeholder="Pega el hash del token..."
            value={hash}
            onChange={(e) => setHash(e.target.value)}
            style={inputStyle}
          />
          {error && <div style={{ color: "#f66", fontSize: 13 }}>{error}</div>}
          {result && (
            <div style={{ background: "#111", padding: 12, borderRadius: 8, fontSize: 13, color: "#ccc" }}>
              <div style={{ color: result.valid ? "#4f8" : "#f66", fontWeight: "bold", marginBottom: 6 }}>
                {result.valid ? "✅ Token Válido" : "❌ Token Inválido"}
              </div>
              <div>De: {result.fromUser}</div>
              <div>Para: {result.toUser}</div>
              <div>Item: {result.itemId} x{result.quantity}</div>
              <div style={{ fontSize: 11, color: "#666", marginTop: 4 }}>
                Creado: {new Date(result.createdAt).toLocaleString()}
              </div>
            </div>
          )}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={verify} style={{ ...btnStyle, background: "#3a6b8c" }}>Verificar</button>
            <button onClick={onClose} style={{ ...btnStyle, background: "#555" }}>Cerrar</button>
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
