import { useState } from "react";
import { useAuth } from "../context/AuthContext";

export default function LoginPage() {
  const { login, register } = useAuth();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setError("");
      if (isRegister) {
        await register(email, username, password);
      } else {
        await login(email, password);
      }
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h1 style={{ color: "#ffd700", margin: 0, fontSize: 32 }}>⚔️ Merchant Quest</h1>
        <p style={{ color: "#aaa", marginTop: 8 }}>Comercio, aventura y subastas</p>

        <form onSubmit={handleSubmit} style={{ marginTop: 24, display: "flex", flexDirection: "column", gap: 12 }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
          />
          {isRegister && (
            <input
              placeholder="Nombre de usuario"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              style={inputStyle}
            />
          )}
          <input
            type="password"
            placeholder="Contraseña"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={inputStyle}
          />
          {error && <div style={{ color: "#f66", fontSize: 13 }}>{error}</div>}
          <button type="submit" style={btnStyle}>
            {isRegister ? "Registrarse" : "Iniciar Sesión"}
          </button>
        </form>

        <button
          onClick={() => setIsRegister(!isRegister)}
          style={{ background: "none", border: "none", color: "#888", marginTop: 12, cursor: "pointer", fontSize: 13 }}
        >
          {isRegister ? "¿Ya tienes cuenta? Inicia sesión" : "¿No tienes cuenta? Regístrate"}
        </button>
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  minHeight: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: "#0a0a1a",
};

const cardStyle: React.CSSProperties = {
  background: "#1a1a2e",
  border: "2px solid #333",
  borderRadius: 16,
  padding: 32,
  textAlign: "center",
  minWidth: 340,
};

const inputStyle: React.CSSProperties = {
  padding: "10px 14px",
  borderRadius: 8,
  border: "1px solid #444",
  background: "#111",
  color: "#eee",
  fontSize: 14,
};

const btnStyle: React.CSSProperties = {
  padding: "12px",
  borderRadius: 8,
  border: "none",
  background: "linear-gradient(135deg, #4a7c59, #3a6b49)",
  color: "#fff",
  fontSize: 16,
  fontWeight: "bold",
  cursor: "pointer",
};
