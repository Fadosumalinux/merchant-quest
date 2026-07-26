const API_URL = "/api";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem("mq_token");
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...((options.headers as Record<string, string>) || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error || "Request failed");
  }
  return res.json();
}

export const api = {
  auth: {
    register: (data: { email: string; username: string; password: string }) =>
      request<{ token: string; user: { id: string; username: string; level: number; gold: number } }>(
        "/auth/register",
        { method: "POST", body: JSON.stringify(data) }
      ),
    login: (data: { email: string; password: string }) =>
      request<{ token: string; user: { id: string; username: string; level: number; gold: number } }>(
        "/auth/login",
        { method: "POST", body: JSON.stringify(data) }
      ),
    me: () => request<any>("/auth/me"),
  },
  zones: {
    list: () => request<any[]>("/zones"),
    get: (id: string) => request<any>(`/zones/${id}`),
    travel: (id: string) => request<any>(`/zones/travel/${id}`, { method: "POST" }),
  },
  trades: {
    create: (data: { toUserId: string; itemId: string; quantity: number; zoneId: string }) =>
      request<any>("/trades", { method: "POST", body: JSON.stringify(data) }),
    verify: (tokenHash: string) => request<any>(`/trades/verify/${tokenHash}`),
    history: () => request<any[]>("/trades/history"),
  },
  inventory: {
    list: () => request<any[]>("/inventory"),
  },
};
