// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import * as authService from "../services/authService"; // ton service axios existant

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Vérifie si l'utilisateur est déjà connecté
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setToken(storedToken);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // LOGIN existant
  const login = async (email, mdp) => {
    const response = await authService.login({ email, mdp });
    const { token: jwtToken, user: userData } = response.data;

    localStorage.setItem("token", jwtToken);
    localStorage.setItem("user", JSON.stringify(userData));

    setToken(jwtToken);
    setUser(userData);
    return { token: jwtToken, user: userData };
  };

  // LOGOUT existant
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
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
      value={{ user, token, loading, login, logout, isAuthenticated, register }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
