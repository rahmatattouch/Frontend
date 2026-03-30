
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const USERS_API_URL = `${BASE_URL}/api/users`;
const API_BASE = `${BASE_URL}/api`;

const apiCall = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const token = localStorage.getItem('token');

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    const errorData = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("STATUS:", response.status);
      console.error("BACKEND MESSAGE:", errorData);
      throw new Error(errorData.message || `HTTP Error: ${response.status}`);
    }

    return errorData;
  } catch (error) {
    console.error(`API Error at ${endpoint}:`, error);
    throw error;
  }
};



export const register = (data) => {
  return axios.post(`${USERS_API_URL}/register`, data);
};

export const login = ({ email, mdp }) => {
  return axios.post(`${USERS_API_URL}/login`, { email, mdp });
};

export const getCurrentUser = async () => {
  return apiCall('/users/me', {
    method: 'GET',
  });
};

export const getAllUsers = async () => {
  return apiCall('/users', {
    method: 'GET',
  });
};

export const createUser = async (userData) => {
  return apiCall('/users/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
};

export const updateUser = async (userId, userData) => {
  return apiCall(`/users/${userId}`, {
    method: 'PUT',
    body: JSON.stringify(userData),
  });
};

export const deleteUser = async (userId) => {
  return apiCall(`/users/${userId}`, {
    method: 'DELETE',
  });
};


export const getUserById = async (userId) => {
  return apiCall(`/users/${userId}`, {
    method: 'GET',
  });
};


export const getVulnerabilities = async () => {
  return apiCall('/users/vulnerabilities', {
    method: 'GET',
  });
};

export const getLabs = async () => {
  return apiCall('/users/labs', {
    method: 'GET',
  });
};

export const analyzeSite = async (url, mode) => {
  try {
    const response = await axios.post("http://localhost:5000/api/audit/launch", {
      targetUrl: url,
      intensity: mode, // rapide | standard | approfondi
    });
    return response.data;
  } catch (err) {
    console.error("Erreur analyse site:", err);
    throw err;
  }
};

export const getStatistics = async () => {
  return apiCall('/users/statistics', {
    method: 'GET',
  });
};

export const getPlatformStats = async () => {
  return apiCall('/users/stats/platform', {
    method: 'GET',
  });
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
};

export default authService;