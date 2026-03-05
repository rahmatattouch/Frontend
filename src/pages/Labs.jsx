// src/pages/Labs.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGlobal } from "../context/GlobalContext";

const Labs = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useGlobal();
  const [url, setUrl] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleScan = () => {
    if (!url) return;
    alert(`${t("scan_lab_button")} : ${url}`);
    setUrl("");
  };

  return (
    <div
      className={`min-h-screen flex bg-gradient-to-br from-green-50 via-white to-green-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 text-gray-900 dark:text-gray-100 transition-all duration-500 ${
        language === "ar" ? "rtl" : "ltr"
      }`}
    >
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-xl border-r border-green-100 dark:border-gray-700 flex flex-col p-6">
        <h2 className="text-2xl font-extrabold text-green-700 dark:text-green-400 mb-10">SecureLab</h2>
        <nav className="flex flex-col gap-4 text-gray-700 dark:text-gray-200">
          <button onClick={() => navigate("/dashboard")} className="hover:bg-green-50 dark:hover:bg-green-600 px-4 py-2 rounded-xl text-left transition">
             {t("dashboard")}
          </button>
          <button onClick={() => navigate("/statistics")} className="hover:bg-green-50 dark:hover:bg-green-600 px-4 py-2 rounded-xl text-left transition">
             {t("statistics")}
          </button>
          <button className="bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-100 px-4 py-2 rounded-xl text-left">
             {t("labs")}
          </button>
          <button onClick={() => navigate("/settings")} className="hover:bg-green-50 dark:hover:bg-green-600 px-4 py-2 rounded-xl text-left transition">
             {t("settings")}
          </button>
        </nav>
        <div className="mt-auto pt-10">
          <button onClick={handleLogout} className="bg-red-500 text-white dark:bg-red-600 dark:hover:bg-red-700 px-4 py-2 rounded-xl hover:bg-red-600 transition">
            {t("logout")}
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 flex flex-col items-center justify-center p-10">
        <div className="max-w-xl w-full bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-10 border border-green-100 dark:border-gray-700 transform transition-all duration-500 hover:scale-[1.02]">
          <h1 className="text-3xl font-extrabold text-green-700 dark:text-green-400 mb-6 text-center animate-pulse">
            {t("scan_lab_title")}
          </h1>
          <p className="text-green-600 dark:text-green-300 mb-6 text-center">
            {t("scan_lab_desc")}
          </p>

          <div className="flex gap-3">
            <input
              type="text"
              placeholder={t("scan_lab_placeholder")}
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className="flex-1 border border-green-200 dark:border-gray-600 rounded-xl px-5 py-3 focus:ring-4 focus:ring-green-300 dark:focus:ring-green-600 dark:bg-gray-900 dark:text-gray-100 transition shadow-sm duration-300 hover:shadow-md placeholder-green-400 dark:placeholder-green-300"
            />
            <button
              onClick={handleScan}
              className="bg-green-600 text-white px-6 py-3 rounded-xl hover:bg-green-700 transition shadow-lg hover:shadow-xl font-semibold transform hover:-translate-y-1 hover:scale-105 motion-reduce:transform-none"
            >
              {t("scan_lab_button")}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Labs;