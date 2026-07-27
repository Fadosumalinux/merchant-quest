const API_URL = import.meta.env.VITE_API_URL || "/api";

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
      request<{ token: string; user: any }>("/auth/register", { method: "POST", body: JSON.stringify(data) }),
    login: (data: { email: string; password: string }) =>
      request<{ token: string; user: any }>("/auth/login", { method: "POST", body: JSON.stringify(data) }),
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
  achievements: {
    list: () => request<any[]>("/achievements"),
    mine: () => request<any[]>("/achievements/mine"),
    quiz: (id: string, answer: string) =>
      request<any>(`/achievements/${id}/quiz`, { method: "POST", body: JSON.stringify({ answer }) }),
    earn: (id: string) =>
      request<any>(`/achievements/${id}/earn`, { method: "POST" }),
    stats: () => request<any>("/achievements/stats"),
  },
  avatars: {
    list: () => request<any[]>("/avatars"),
    mine: () => request<any>("/avatars/mine"),
    equip: (avatarId: string) =>
      request<any>("/avatars/equip", { method: "POST", body: JSON.stringify({ avatarId }) }),
    customize: (style: any) =>
      request<any>("/avatars/customize", { method: "PUT", body: JSON.stringify({ style }) }),
  },
  reviews: {
    post: (data: { tradeId: string; rating: number; comment?: string }) =>
      request<any>("/reviews", { method: "POST", body: JSON.stringify(data) }),
    forUser: (userId: string) => request<any>(`/reviews/user/${userId}`),
  },
};
