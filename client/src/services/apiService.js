import axios from "axios";

const API_BASE_URL = "http://localhost:5000/api";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth API
export const authAPI = {
  register: (userData) => api.post("/auth/register", userData),
  login: (credentials) => api.post("/auth/login", credentials),
  getProfile: () => api.get("/auth/profile"),
};

// Goals API
export const goalsAPI = {
  create: (goalData) => api.post("/goals", goalData),
  getAll: () => api.get("/goals"),
  update: (id, goalData) => api.put(`/goals/${id}`, goalData),
  delete: (id) => api.delete(`/goals/${id}`),
};

// Sessions API
export const sessionsAPI = {
  create: (sessionData) => api.post("/sessions", sessionData),
  getAll: () => api.get("/sessions"),
  update: (id, sessionData) => api.put(`/sessions/${id}`, sessionData),
  delete: (id) => api.delete(`/sessions/${id}`),
};

// Milestones API
export const milestonesAPI = {
  create: (milestoneData) => api.post("/milestones", milestoneData),
  getAll: () => api.get("/milestones"),
  getUpcoming: () => api.get("/milestones/upcoming"),
  update: (id, milestoneData) => api.put(`/milestones/${id}`, milestoneData),
  delete: (id) => api.delete(`/milestones/${id}`),
};

// Analytics API
export const analyticsAPI = {
  getAnalytics: () => api.get("/analytics"),
  getDetailed: (params) => api.get("/analytics/detailed", { params }),
};

export default api;
