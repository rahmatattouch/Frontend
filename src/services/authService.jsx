import axios from "axios";

/**
 * Base URL
 * - VITE_API_URL doit être comme: http://localhost:5000
 */
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/**
 * API Roots
 * Ton backend expose déjà: /api/users/...
 */
const API_BASE = `${BASE_URL}/api`;
const USERS_API_URL = `${API_BASE}/users`;

/**
 * Petit helper pour récupérer le token
 */
const getToken = () => localStorage.getItem("token");

/**
 * Wrapper fetch JSON (avec Bearer token)
 */
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const token = getToken();

  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const response = await fetch(url, {
    ...options,
    headers,
  });

  // Réponse (peut être vide)
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    const message = data?.message || `HTTP Error: ${response.status}`;
    throw new Error(message);
  }

  return data;
};

// ---------------- Auth (axios) ----------------
// (on garde axios ici car tu l'utilises déjà côté login/register)
export const register = (data) => axios.post(`${USERS_API_URL}/register`, data);
export const login = ({ email, mdp }) => axios.post(`${USERS_API_URL}/login`, { email, mdp });

// ---------------- Users ----------------

/**
 * IMPORTANT:
 * Tu n'as pas /api/users/me dans tes routes actuelles (sauf si tu l'as ailleurs).
 * Donc je le laisse, mais il ne marchera que si tu ajoutes la route côté backend.
 */
export const getCurrentUser = async () => {
  return apiCall("/users/me", { method: "GET" });
};

/**
 * ADMIN USERS LIST
 * Backend: GET /api/users/admin/users
 * => c'est LA correction qui débloque l'affichage dans AdminUsers.
 */
export const getAllUsers = async () => {
  return apiCall("/users/admin/users", { method: "GET" });
};

/**
 * CREATE USER (ADMIN)
 * Backend: POST /api/users/ajouter
 * (pas /register, car register est public et peut avoir upload image)
 */
export const createUser = async (userData) => {
  return apiCall("/users/ajouter", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

/**
 * UPDATE USER
 * Backend: PUT /api/users/:id
 */
export const updateUser = async (userId, userData) => {
  return apiCall(`/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
};

/**
 * DELETE USER (ADMIN)
 * Backend: DELETE /api/users/:id
 */
export const deleteUser = async (userId) => {
  return apiCall(`/users/${userId}`, { method: "DELETE" });
};

export const getUserById = async (userId) => {
  return apiCall(`/users/${userId}`, { method: "GET" });
};
 export const getAllAuditsAdmin = async () => {
  return apiCall("/users/admin/audits", { method: "GET" });
};

// ---------------- Autres endpoints (si ils existent vraiment côté backend) ----------------
// NOTE: ces routes ne sont pas dans le userRoutes que tu m'as montré.
// Garde-les seulement si tu as bien les endpoints côté serveur.
export const getVulnerabilities = async () => apiCall("/users/vulnerabilities", { method: "GET" });
export const getLabs = async () => apiCall("/users/labs", { method: "GET" });
export const getStatistics = async () => apiCall("/users/statistics", { method: "GET" });
export const getPlatformStats = async () => apiCall("/users/stats/platform", { method: "GET" });

// ---------------- Audit launch ----------------
export const analyzeSite = async (url, mode) => {
  try {
    // utilise BASE_URL (au lieu de hardcoder localhost)
    const response = await axios.post(`${BASE_URL}/api/audit/launch`, {
      targetUrl: url,
      intensity: mode, // rapide | standard | approfondi
    });
    return response.data;
  } catch (err) {
    console.error("Erreur analyse site:", err);
    throw err;
  }
};
const authService = {
  register,
  login,
  getCurrentUser,
  getAllUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  getVulnerabilities,
  getLabs,
  analyzeSite,
  getStatistics,
  getPlatformStats,
  getAllAuditsAdmin
};

export default authService;