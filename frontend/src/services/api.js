import axios from "axios";

const API_BASE = "/api"; // proxy from package.json

// Helper to get token
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// AUTH APIs
export const authAPI = {
  signup: (userData) =>
    axios.post(`${API_BASE}/auth/signup`, userData, {
      headers: { "Content-Type": "application/json" },
    }),
  login: (credentials) =>
    axios.post(`${API_BASE}/auth/login`, credentials, {
      headers: { "Content-Type": "application/json" },
    }),
};

// EXPENSE APIs
export const expenseAPI = {
  getAll: async () => {
    try {
      return await axios.get(`${API_BASE}/expenses`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });
    } catch (err) {
      handleAuthError(err);
      throw err;
    }
  },
  create: async (expenseData) => {
    try {
      return await axios.post(`${API_BASE}/expenses`, expenseData, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });
    } catch (err) {
      handleAuthError(err);
      throw err;
    }
  },
  update: async (id, expenseData) => {
    try {
      return await axios.put(`${API_BASE}/expenses/${id}`, expenseData, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });
    } catch (err) {
      handleAuthError(err);
      throw err;
    }
  },
  delete: async (id) => {
    try {
      return await axios.delete(`${API_BASE}/expenses/${id}`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });
    } catch (err) {
      handleAuthError(err);
      throw err;
    }
  },
  getStats: async () => {
    try {
      return await axios.get(`${API_BASE}/expenses/stats`, {
        headers: {
          "Content-Type": "application/json",
          ...getAuthHeaders(),
        },
      });
    } catch (err) {
      handleAuthError(err);
      throw err;
    }
  },
};

// Error handler
const handleAuthError = (error) => {
  if (error.response?.status === 401 || error.response?.status === 403) {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
};

export const setAuthToken = (token) => {
  if (token) {
    localStorage.setItem("token", token);
  } else {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  }
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  window.location.href = "/login";
};
