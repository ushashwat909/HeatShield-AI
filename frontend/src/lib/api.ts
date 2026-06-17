import axios from "axios";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: { "Content-Type": "application/json" },
});

// Request interceptor for auth tokens
api.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("heatshield_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export const heatmapApi = {
  getData: (layer = "lst") => api.get(`/api/heatmap/?layer=${layer}`),
};

export const predictionsApi = {
  getData: (regionId = 0, horizon = 30) =>
    api.get(`/api/predictions/?region_id=${regionId}&horizon=${horizon}`),
};

export const hotspotsApi = {
  getData: (topN = 10) => api.get(`/api/hotspots/?top_n=${topN}`),
};

export const recommendationsApi = {
  getData: () => api.get("/api/recommendations/"),
};

export const simulatorApi = {
  run: (params: {
    trees_added: number;
    cool_roof_coverage_pct: number;
    green_roof_coverage_pct: number;
    reflective_pavement_pct: number;
  }) => api.post("/api/simulator/", params),
};

export const reportsApi = {
  generate: (city = "Delhi") => api.get(`/api/reports/?city=${city}`),
  getDashboardSummary: () => api.get("/api/reports/dashboard-summary"),
};

export const authApi = {
  login: (username: string, password: string) =>
    api.post("/api/auth/login", { username, password }),
  register: (data: { username: string; email: string; password: string; full_name?: string }) =>
    api.post("/api/auth/register", data),
};

export default api;
