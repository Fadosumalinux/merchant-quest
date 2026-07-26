import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { api } from "../utils/api";
import type { User } from "../types";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, username: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>(null!);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const data = await api.auth.me();
      setUser(data);
    } catch {
      setUser(null);
      localStorage.removeItem("mq_token");
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("mq_token");
    if (token) {
      refreshUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    const { token } = await api.auth.login({ email, password });
    localStorage.setItem("mq_token", token);
    await refreshUser();
  };

  const register = async (email: string, username: string, password: string) => {
    const { token } = await api.auth.register({ email, username, password });
    localStorage.setItem("mq_token", token);
    await refreshUser();
  };

  const logout = () => {
    localStorage.removeItem("mq_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
