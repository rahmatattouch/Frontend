import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger session depuis localStorage
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        setUser(JSON.parse(storedUser));
        setToken(storedToken);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, mdp) => {
    const response = await authService.login({ email, mdp });
    const { token: jwtToken, user: userData } = response.data;

    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(jwtToken);
    setUser(userData);

    return { token: jwtToken, user: userData };
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
  };
<<<<<<< HEAD
const updateUser = (newData) => {
  const updated = { ...user, ...newData };
  localStorage.setItem("user", JSON.stringify(updated));
  setUser(updated);
};
  // ✅ NOUVEAU : REGISTER
  const register = async (data) => {
    try {
      // data = { nom, prenom, email, mdp }
      const response = await authService.register(data); // service axios vers /api/register
      // Si tu veux, tu peux directement connecter l'utilisateur après l'inscription
      // setUser(response.data.user);
      return response.data;
    } catch (err) {
      throw new Error(err.response?.data?.message || "Registration failed");
    }
  };


  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{ user, token, loading, login, logout, isAuthenticated, register,updateUser  }}
    >
=======

  /**
   * REGISTER
   * - accepte un objet JSON {nom, prenom, email, mdp}
   * - ou un FormData (si tu envoies image)
   */
  const register = async (data) => {
  try {
    const response = await authService.register(data);
    return response.data;
  } catch (err) {
    const msg = err?.response?.data?.message || err?.message || "Registration failed";
    throw new Error(msg);
  }
};
  const isAuthenticated = useMemo(() => !!token, [token]);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, isAuthenticated, register }}>
>>>>>>> 1ae9dce91a9113572736dee6eba824c2900b2b0a
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};