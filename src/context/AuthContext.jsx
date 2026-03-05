// AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import * as authService from "../services/authService";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");

    if (storedToken && storedUser) {
      setToken(storedToken);
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAdmin(userData.role === "admin" || userData.isAdmin);
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
    setIsAdmin(userData.role === "admin" || userData.isAdmin);
    return { token: jwtToken, user: userData };
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setToken(null);
    setIsAdmin(false);
  };

  return <AuthContext.Provider value={{ user, token, loading, isAdmin, login, logout, isAuthenticated: !!token }}>{children}</AuthContext.Provider>;
};

// Export du hook séparé
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};