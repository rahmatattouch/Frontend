// src/pages/Settings.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGlobal } from "../context/GlobalContext.jsx";

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Utilisation du contexte global
  const { darkMode, setDarkMode, language, setLanguage } = useGlobal();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 dark:bg-gray-900 dark:text-gray-100 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-xl border-r border-green-100 dark:border-gray-700 flex flex-col p-6">
        <h2 className="text-2xl font-extrabold text-green-700 dark:text-green-400 mb-10">
          SecureLab
        </h2>

        <nav className="flex flex-col gap-4 text-gray-700 dark:text-gray-200">
          <button
            onClick={() => navigate("/dashboard")}
            className="hover:bg-green-50 dark:hover:bg-green-600 px-4 py-2 rounded-xl text-left transition"
          >
          {t("dashboard")}
          </button>
          <button
            onClick={() => navigate("/statistics")}
            className="hover:bg-green-50 dark:hover:bg-green-600 px-4 py-2 rounded-xl text-left transition"
          >
           {t("statistics")}
          </button>
          <button
            onClick={() => navigate("/labs")}
            className="hover:bg-green-50 dark:hover:bg-green-600 px-4 py-2 rounded-xl text-left transition"
          >
        {t("labs")}
          </button>
          <button className="bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-100 px-4 py-2 rounded-xl text-left">
            {t("settings")}
          </button>
        </nav>

        <div className="mt-auto pt-10">
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white dark:bg-red-600 dark:hover:bg-red-700 px-4 py-2 rounded-xl hover:bg-red-600 transition"
          >
            {t("logout")}
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-10 space-y-10">
        <div>
          <h1 className="text-4xl font-extrabold text-green-700 dark:text-green-400">
            {t("settings")} - {user?.prenom || user?.nom}
          </h1>
          <p className="text-green-600 dark:text-green-300 mt-2">{t("others")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          {/* Dark Mode */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-green-100 dark:border-gray-700 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-4">
              {t("dark_mode")}
            </h2>
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={darkMode}
                onChange={(e) => setDarkMode(e.target.checked)}
                className="h-5 w-5 accent-green-500"
              />
              <span>{darkMode ? " On" : " Off"}</span>
            </label>
          </div>

          {/* Language */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-green-100 dark:border-gray-700 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-4">
              {t("language")}
            </h2>
            <select
              value={language}
              onChange={handleLanguageChange}
              className="w-full border border-green-200 dark:border-gray-600 rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
            >
              <option value="fr">Français</option>
              <option value="en">English</option>
              <option value="ar">العربية</option>
            </select>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Settings;