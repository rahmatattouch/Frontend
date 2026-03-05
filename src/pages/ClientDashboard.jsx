// src/pages/ClientDashboard.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useGlobal } from "../context/GlobalContext.jsx";
import { useTranslation } from "react-i18next";

const ClientDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { darkMode } = useGlobal();
  const { t } = useTranslation();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [profileData, setProfileData] = useState({
    nom: user?.nom || "",
    prenom: user?.prenom || "",
    email: user?.email || "",
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileSubmit = (e) => {
    e.preventDefault();
    console.log("Profile update:", profileData);
    setIsEditingProfile(false);
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className={`min-h-screen flex ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gradient-to-br from-green-50 via-white to-green-100"}`}>
      
      {/* SIDEBAR */}
      <aside className={`w-64 ${darkMode ? "bg-gray-800 border-gray-700 text-gray-200" : "bg-white border-green-100 text-gray-700"} shadow-xl border-r flex flex-col p-6`}>
        <h2 className={`text-2xl font-extrabold ${darkMode ? "text-green-400" : "text-green-700"} mb-10`}>SecureLab</h2>

        <nav className="flex flex-col gap-4">
          <button onClick={() => navigate("/dashboard")} className={`px-4 py-2 rounded-xl text-left ${darkMode ? "hover:bg-green-700 bg-green-700 text-green-100" : "bg-green-100 text-green-700 hover:bg-green-50"} transition`}>
             {t("dashboard")}
          </button>

          <button onClick={() => navigate("/statistics")} className="hover:bg-green-50 dark:hover:bg-green-600 px-4 py-2 rounded-xl text-left transition">
            {t("statistics")}
          </button>

          <button onClick={() => navigate("/labs")} className="hover:bg-green-50 dark:hover:bg-green-600 px-4 py-2 rounded-xl text-left transition">
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

      {/* CONTENU PRINCIPAL */}
      <main className="flex-1 p-10 space-y-10">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-extrabold text-green-700"> Bienvenue, {user?.prenom || user?.nom || "Utilisateur"}  </h1>
          <p className={`${darkMode ? "text-green-300" : "text-green-600"} mt-2`}>
            {t("dashboard_intro")}
          </p>
        </div>

        {/* Cards statistiques rapides */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`rounded-2xl shadow-lg p-6 border hover:shadow-xl transition ${darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-green-100 text-gray-700"}`}>
            <p className="text-gray-500">{t("tests_completed")}</p>
            <h2 className="text-3xl font-bold text-green-600 mt-2">5</h2>
          </div>

          <div className={`rounded-2xl shadow-lg p-6 border hover:shadow-xl transition ${darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-green-100 text-gray-700"}`}>
            <p className="text-gray-500">{t("available_labs")}</p>
            <h2 className="text-3xl font-bold text-green-600 mt-2">12</h2>
          </div>

          <div className={`rounded-2xl shadow-lg p-6 border hover:shadow-xl transition ${darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-green-100 text-gray-700"}`}>
            <p className="text-gray-500">{t("progress")}</p>
            <h2 className="text-3xl font-bold text-green-600 mt-2">85%</h2>
          </div>
        </div>

        {/* Profil */}
        <div className={`rounded-2xl shadow-lg p-8 border max-w-lg ${darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-green-100"}`}>
          <div className="flex justify-between items-center mb-6">
            <h2 className={`text-2xl font-bold ${darkMode ? "text-green-400" : "text-green-700"}`}>{t("my_profile")}</h2>

            {!isEditingProfile && (
              <button
                className="bg-green-600 text-white px-4 py-2 rounded-xl hover:bg-green-700 transition"
                onClick={() => setIsEditingProfile(true)}
              >
                {t("edit")}
              </button>
            )}
          </div>

          {!isEditingProfile ? (
            <div className="space-y-4 text-lg">
              <p><span className="font-semibold text-green-700 dark:text-green-400">{t("last_name")} :</span> {user?.nom}</p>
              {user?.prenom && <p><span className="font-semibold text-green-700 dark:text-green-400">{t("first_name")} :</span> {user.prenom}</p>}
              <p><span className="font-semibold text-green-700 dark:text-green-400">{t("email")} :</span> {user?.email}</p>
            </div>
          ) : (
            <form onSubmit={handleProfileSubmit} className="space-y-4">
              <input
                type="text"
                name="nom"
                value={profileData.nom}
                onChange={handleProfileChange}
                className="w-full border border-green-200 dark:border-gray-600 rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                placeholder={t("last_name")}
              />
              <input
                type="text"
                name="prenom"
                value={profileData.prenom}
                onChange={handleProfileChange}
                className="w-full border border-green-200 dark:border-gray-600 rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                placeholder={t("first_name")}
              />
              <input
                type="email"
                name="email"
                value={profileData.email}
                onChange={handleProfileChange}
                className="w-full border border-green-200 dark:border-gray-600 rounded-xl px-4 py-2 focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-gray-100"
                placeholder={t("email")}
              />

              <div className="flex gap-3 pt-2">
                <button className="bg-green-600 text-white px-5 py-2 rounded-xl hover:bg-green-700 transition">
                  {t("save")}
                </button>
                <button
                  type="button"
                  className="bg-gray-200 px-5 py-2 rounded-xl hover:bg-gray-300 transition dark:bg-gray-700 dark:text-gray-100 dark:hover:bg-gray-600"
                  onClick={() => setIsEditingProfile(false)}
                >
                  {t("cancel")}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  );
};

export default ClientDashboard;