// src/pages/Statistics.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useGlobal } from "../context/GlobalContext";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from "chart.js";
import { Line, Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const Statistics = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { language } = useGlobal();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const labs = ["Lab1", "Lab2", "Lab3", "Lab4", "Lab5"];
  const scores = [10, 25, 45, 65, 85];

  const lineData = {
    labels: labs,
    datasets: [{
      label: t("cumulative_progress"),
      data: scores,
      fill: true,
      backgroundColor: "rgba(16,185,129,0.2)",
      borderColor: "#10b981",
      tension: 0.4,
      pointBackgroundColor: "#10b981",
    }],
  };

  const barData = {
    labels: labs,
    datasets: [{
      label: t("lab_scores"),
      data: [10, 15, 20, 20, 20],
      backgroundColor: scores.map(score => `rgba(16,185,129,${score / 100})`),
    }],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "top", labels: { color: "#10b981" } },
      title: { display: true, text: t("statistics_advanced_title"), color: "#10b981", font: { size: 18 } },
    },
    scales: {
      x: { ticks: { color: "#16a34a" }, grid: { color: "rgba(16,185,129,0.1)" } },
      y: { ticks: { color: "#16a34a" }, grid: { color: "rgba(16,185,129,0.1)" } },
    },
  };

  return (
    <div
      className={`min-h-screen bg-gradient-to-br from-green-50 via-white to-green-100 dark:bg-gray-900 dark:text-gray-100 flex ${
        language === "ar" ? "rtl" : "ltr"
      }`}
    >
      {/* Sidebar */}
      <aside className="w-64 bg-white dark:bg-gray-800 shadow-xl border-r border-green-100 dark:border-gray-700 flex flex-col p-6">
        <h2 className="text-2xl font-extrabold text-green-700 dark:text-green-400 mb-10">SecureLab</h2>
        <nav className="flex flex-col gap-4 text-gray-700 dark:text-gray-200">
          <button onClick={() => navigate("/dashboard")} className="hover:bg-green-50 dark:hover:bg-green-600 px-4 py-2 rounded-xl text-left transition">🏠 {t("dashboard")}</button>
          <button className="bg-green-100 dark:bg-green-700 text-green-700 dark:text-green-100 px-4 py-2 rounded-xl text-left">📊 {t("statistics")}</button>
          <button onClick={() => navigate("/labs")} className="hover:bg-green-50 dark:hover:bg-green-600 px-4 py-2 rounded-xl text-left transition">📚 {t("labs")}</button>
          <button onClick={() => navigate("/settings")} className="hover:bg-green-50 dark:hover:bg-green-600 px-4 py-2 rounded-xl text-left transition">⚙️ {t("settings")}</button>
        </nav>
        <div className="mt-auto pt-10">
          <button onClick={handleLogout} className="bg-red-500 text-white dark:bg-red-600 dark:hover:bg-red-700 px-4 py-2 rounded-xl hover:bg-red-600 transition">{t("logout")}</button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 p-10 space-y-10">
        <div>
          <h1 className="text-4xl font-extrabold text-green-700 dark:text-green-400">{t("statistics_advanced_title")} {user?.prenom || user?.nom || t("user")}</h1>
          <p className="text-green-600 dark:text-green-300 mt-2">{t("follow_progress_desc")}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-green-100 dark:border-gray-700 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-4">{t("cumulative_progress")}</h2>
            <Line data={lineData} options={options} />
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-green-100 dark:border-gray-700 hover:shadow-xl transition">
            <h2 className="text-xl font-semibold text-green-700 dark:text-green-400 mb-4">{t("lab_scores")}</h2>
            <Bar data={barData} options={options} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Statistics;