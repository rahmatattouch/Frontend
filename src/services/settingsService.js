import axios from "axios";

const API_BASE = "http://localhost:5000/api";

function getAuthHeaders() {
  const token = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${token}`,
  };
}

export async function getAdminSettings() {
  return axios.get(`${API_BASE}/admin/settings`, {
    headers: getAuthHeaders(),
  });
}

export async function updateAdminSettings(payload) {
  return axios.put(`${API_BASE}/admin/settings`, payload, {
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeaders(),
    },
  });
}