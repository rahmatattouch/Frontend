const BASE_URL = "http://localhost:5000/api/dashboard";

const apiFetch = async (endpoint) => {
  const token = localStorage.getItem("token");
  
  try {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error: ${res.status}`);
    }

    const data = await res.json();
    return { data };
  } catch (error) {
    console.error(`Dashboard API Error at ${endpoint}:`, error);
    throw error;
  }
};

export const getStats = async () => {
  try {
    return await apiFetch("/stats");
  } catch (err) {
    console.error("Stats Error:", err);
    return { data: { totalScans: 0, vulnerabilities: 0, secureSites: 0, riskScore: 0 } };
  }
};

export const getRecentScans = async () => {
  try {
    return await apiFetch("/recent-scans");
  } catch (err) {
    console.error("Recent Scans Error:", err);
    return { data: [] };
  }
};

export const getAlerts = async () => {
  try {
    return await apiFetch("/alerts");
  } catch (err) {
    console.error("Alerts Error:", err);
    return { data: [] };
  }
};

export const getScoreEvolution = async () => {
  try {
    return await apiFetch("/score-evolution");
  } catch (err) {
    console.error("Score Evolution Error:", err);
    return { data: [] };
  }
};