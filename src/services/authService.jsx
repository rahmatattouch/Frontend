
import axios from "axios";


const API_URL = "http://localhost:5000/api/users";
const apiCall = async (endpoint, options = {}) => {
  const url = `${API_URL}${endpoint}`;
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
  return axios.post(`${API_URL}/register`, data);
};

export const login = ({ email, mdp }) => {
  return axios.post(`${API_URL}/login`, { email, mdp });
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
  return apiCall('/vulnerabilities', {
    method: 'GET',
  });
};

export const getLabs = async () => {
  return apiCall('/labs', {
    method: 'GET',
  });
};

export const getStatistics = async () => {
  return apiCall('/statistics', {
    method: 'GET',
  });
};

export const getPlatformStats = async () => {
  return apiCall('/stats/platform', {
    method: 'GET',
  });
};
const authService = {
  register,
  login,
  getCurrentUser,
  getAllUsers,
  updateUser,
  deleteUser,
  getUserById,
  getVulnerabilities,
  getLabs,
  getStatistics,
  getPlatformStats,
};

export default authService;