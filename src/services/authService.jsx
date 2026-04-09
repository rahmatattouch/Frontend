import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const USERS_API_URL = `${BASE_URL}/api/users`;
const API_BASE = `${BASE_URL}/api`;

const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...options.headers,
  };

  if (token) headers.Authorization = `Bearer ${token}`;

  try {
    const response = await fetch(url, { ...options, headers });
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("STATUS:", response.status);
      console.error("BACKEND MESSAGE:", data);
      throw new Error(data.message || `HTTP Error: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API Error at ${endpoint}:`, error);
    throw error;
  }
};

// ---------- Auth ----------
export const register = (data) => axios.post(`${USERS_API_URL}/register`, data);
export const login = ({ email, mdp }) => axios.post(`${USERS_API_URL}/login`, { email, mdp });

// ---------- Users ----------
// ⚠️ Ton backend n'a PAS /api/users/me actuellement (si tu en as besoin, ajoute la route)
export const getCurrentUser = async () => apiCall("/users/me", { method: "GET" });

// ✅ FIX: ton backend n'a pas GET /api/users
// La liste users est admin-only: GET /api/users/admin/users
export const getAllUsers = async () => {
  return apiCall("/users/admin/users", { method: "GET" });
};

// (optionnel) alias clair
export const getAllUsersAdmin = async () => {
  return apiCall("/users/admin/users", { method: "GET" });
};

// ⚠️ /api/users/register utilise upload.single("image") => normalement FormData.
// Je garde JSON ici si ton backend l'accepte sans image.
// Si ça échoue, dis-moi et je te donne la version FormData.
export const createUser = async (userData) => {
  return apiCall("/users/register", {
    method: "POST",
    body: JSON.stringify(userData),
  });
};

export const updateUser = async (userId, userData) => {
  return apiCall(`/users/${userId}`, {
    method: "PUT",
    body: JSON.stringify(userData),
  });
};

// ⚠️ DELETE user est admin-only côté backend => OK si token admin
export const deleteUser = async (userId) => {
  return apiCall(`/users/${userId}`, { method: "DELETE" });
};

export const getUserById = async (userId) => {
  return apiCall(`/users/${userId}`, { method: "GET" });
};

// ---------- Vulnerabilites ----------
// ✅ FIX: tes routes vulnérabilités sont /api/vulnerabilites (pas /api/users/...)
export const getVulnerabilities = async () => {
  return apiCall("/vulnerabilites/me", { method: "GET" });
};

// ⚠️ Route pas confirmée dans ton backend
export const getLabs = async () => apiCall("/users/labs", { method: "GET" });

// ---------- Audits ----------
export const analyzeSite = async (url, mode) => {
  try {
    const token = localStorage.getItem("token");

    const response = await axios.post(
      `${BASE_URL}/api/audit/launch`,
      { targetUrl: url, intensity: mode },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  } catch (err) {
    console.error("Erreur analyse site:", err);
    throw err;
  }
};

// ---------- Stats ----------
export const getStatistics = async () => apiCall("/stats/full", { method: "GET" });
export const getStatisticsTotals = async () => apiCall("/stats/totals", { method: "GET" });

// ✅ FIX: ton backend n'a pas /api/stats/platform, donc on mappe vers totals
export const getPlatformStats = async () => apiCall("/stats/totals", { method: "GET" });

// ---------- Profile ----------
export const getUserProfile = async (userId, token) => {
  const response = await axios.get(`${BASE_URL}/api/users/${userId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export const updateUserProfile = async (userId, payload, token) => {
  if (!userId) throw new Error("updateUserProfile: userId manquant");

  // ⚠️ Ton backend a aussi PUT /api/users/:id/profile (updateProfileAndPassword)
  // Ici on utilise PUT /api/users/:id (updateUtilisateur) comme dans ton code initial.
  const response = await axios.put(`${USERS_API_URL}/${userId}`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

export function getUserId() {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return null;
  try {
    const parsed = JSON.parse(storedUser);
    return parsed._id || parsed.id || null;
  } catch {
    return null;
  }
}
// ---------- Admin (PDF Report) ----------
export const getAdminAuditReport = async (auditId) => {
  if (!auditId) throw new Error("auditId manquant");
  return apiCall(`/users/admin/audits/${auditId}/report`, { method: "GET" });
};
// ---------- Admin ----------
export const getAllAuditsAdmin = async () => apiCall("/users/admin/audits", { method: "GET" });

const authService = {
  register,
  login,
  getCurrentUser,
  getAllUsers,
  getAllUsersAdmin,
  createUser,
  updateUser,
  deleteUser,
  getUserById,
  getVulnerabilities,
  getLabs,
  analyzeSite,
  getStatistics,
  getPlatformStats,
  getStatisticsTotals,
  getUserProfile,
  updateUserProfile,
  getUserId,
  getAllAuditsAdmin,
  getAdminAuditReport,
};

export default authService;