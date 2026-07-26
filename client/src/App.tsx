import { useAuth } from "./context/AuthContext";
import LoginPage from "./pages/LoginPage";
import GamePage from "./pages/GamePage";

export default function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#0a0a1a", color: "#888" }}>
        Cargando...
      </div>
    );
  }

  return user ? <GamePage /> : <LoginPage />;
}
