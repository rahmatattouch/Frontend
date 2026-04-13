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
<<<<<<< HEAD
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
=======
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
>>>>>>> 1ae9dce91a9113572736dee6eba824c2900b2b0a
export const getAllUsers = async () => {
  return apiCall("/users/admin/users", { method: "GET" });
};

<<<<<<< HEAD
// (optionnel) alias clair
export const getAllUsersAdmin = async () => {
  return apiCall("/users/admin/users", { method: "GET" });
};

// ⚠️ /api/users/register utilise upload.single("image") => normalement FormData.
// Je garde JSON ici si ton backend l'accepte sans image.
// Si ça échoue, dis-moi et je te donne la version FormData.
export const createUser = async (userData) => {
  return apiCall("/users/register", {
=======
/**
 * CREATE USER (ADMIN)
 * Backend: POST /api/users/ajouter
 * (pas /register, car register est public et peut avoir upload image)
 */
export const createUser = async (userData) => {
  return apiCall("/users/ajouter", {
>>>>>>> 1ae9dce91a9113572736dee6eba824c2900b2b0a
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

<<<<<<< HEAD
// ⚠️ DELETE user est admin-only côté backend => OK si token admin
=======
/**
 * DELETE USER (ADMIN)
 * Backend: DELETE /api/users/:id
 */
>>>>>>> 1ae9dce91a9113572736dee6eba824c2900b2b0a
export const deleteUser = async (userId) => {
  return apiCall(`/users/${userId}`, { method: "DELETE" });
};

export const getUserById = async (userId) => {
  return apiCall(`/users/${userId}`, { method: "GET" });
<<<<<<< HEAD
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

=======
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
>>>>>>> 1ae9dce91a9113572736dee6eba824c2900b2b0a
    return response.data;
  } catch (err) {
    console.error("Erreur analyse site:", err);
    throw err;
  }
};
<<<<<<< HEAD

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

=======
>>>>>>> 1ae9dce91a9113572736dee6eba824c2900b2b0a
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
<<<<<<< HEAD
  getStatisticsTotals,
  getUserProfile,
  updateUserProfile,
  getUserId,
  getAllAuditsAdmin,
  getAdminAuditReport,
=======
  getAllAuditsAdmin
>>>>>>> 1ae9dce91a9113572736dee6eba824c2900b2b0a
};

export default authService;