import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import { getStatistics } from "../services/authService";
import { scoreColor, riskBadgeClass } from "../utils/colors";

import Labs from "./Labs";
import Statistics from "./Statistics";
import Settings from "./Settings";

import {
  ShieldCheck,
  ShieldAlert,
  ScanSearch,
  TrendingUp,
  ArrowRight,
  Clock,
} from "lucide-react";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function ClientDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const navigate = useNavigate();

  const { user, logout } = useAuth();

  const [dashStats, setDashStats] = useState(null);

  useEffect(() => {
    getStatistics()
      .then((data) => setDashStats(data))
      .catch((err) => console.error("Erreur chargement stats dashboard:", err));
  }, []);

  // ✅ Logout propre
  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const myStats = [
    { label: "Mes Scans",      value: String(dashStats?.totalScans   ?? 28), icon: ScanSearch },
    { label: "Vulnérabilités", value: String(dashStats?.totalVulns   ?? 47), icon: ShieldAlert },
    { label: "Sites sécurisés",value: String(dashStats?.securedSites ?? 19), icon: ShieldCheck },
    { label: "Score moyen",    value: String(dashStats?.avgScore     ?? 71), icon: TrendingUp },
  ];

  const activityData = dashStats?.activityData || [
    { day: "Lun", score: 65 },
    { day: "Mar", score: 72 },
    { day: "Mer", score: 58 },
    { day: "Jeu", score: 80 },
    { day: "Ven", score: 74 },
    { day: "Sam", score: 90 },
    { day: "Dim", score: 71 },
  ];

  const recentScans = dashStats?.recentScans || [
    { site: "myshop.tn",      score: 82, risk: "Faible",   date: "24/03/2026", vulns: 2 },
    { site: "api.myapp.io",   score: 55, risk: "Élevé",    date: "22/03/2026", vulns: 9 },
    { site: "blog.perso.fr",  score: 90, risk: "Faible",   date: "20/03/2026", vulns: 1 },
    { site: "old-portal.tn",  score: 38, risk: "Critique", date: "18/03/2026", vulns: 17 },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white border rounded-lg px-3 py-2 text-xs shadow">
          <p>{label}</p>
          <p className="text-green-600">Score: {payload[0].value}</p>
        </div>
      );
    }
    return null;
  };

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <div className="space-y-6">

            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h1 className="text-xl font-semibold">
                  Bonjour {user?.name || "Utilisateur"} 👋
                </h1>
                <p className="text-sm text-gray-500">
                  Voici votre dashboard
                </p>
              </div>

              <button
                onClick={() => setActivePage("scan")}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
              >
                <ScanSearch size={14} />
                Lancer un scan
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {myStats.map((stat) => {
                const StatIcon = stat.icon;
                return (
                <div key={stat.label} className="bg-white border rounded-xl p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-gray-500">{stat.label}</span>
                    <StatIcon size={14} />
                  </div>
                  <p className="text-xl font-semibold">{stat.value}</p>
                </div>
                );
              })}
            </div>

            {/* Chart */}
            <div className="bg-white border rounded-xl p-4">
              <p className="text-sm font-medium mb-2">
                Évolution du score
              </p>

              <ResponsiveContainer width="100%" height={200}>
                <LineChart data={activityData}>
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip content={<CustomTooltip />} />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#16a34a"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Alerts + Scans */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

              {/* Alerts */}
              <div className="space-y-3">
                <p className="text-sm font-medium text-gray-900">
                  Alertes récentes
                </p>

                {[
                  { msg: "Certificat SSL expiré détecté sur old-portal.tn", level: "red" },
                  { msg: "En-têtes de sécurité manquants sur api.myapp.io", level: "yellow" },
                  { msg: "myshop.tn — configuration sécurisée", level: "green" },
                ].map((a, i) => (
                  <div
                    key={i}
                    className={`flex items-start gap-3 p-3 rounded-lg border text-xs ${
                      a.level === "red"
                        ? "bg-red-50 border-red-200 text-red-700"
                        : a.level === "yellow"
                        ? "bg-yellow-50 border-yellow-200 text-yellow-700"
                        : "bg-green-50 border-green-200 text-green-700"
                    }`}
                  >
                    <span
                      className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                        a.level === "red"
                          ? "bg-red-500"
                          : a.level === "yellow"
                          ? "bg-yellow-500"
                          : "bg-green-500"
                      }`}
                    />
                    {a.msg}
                  </div>
                ))}
              </div>

              {/* Recent scans */}
              <div className="lg:col-span-2 bg-white border rounded-xl p-4">
                <div className="flex justify-between mb-4">
                  <p className="text-sm font-medium">
                    Derniers scans
                  </p>

                  <button
                    onClick={() => setActivePage("stats")}
                    className="flex items-center gap-1 text-xs text-green-600 hover:underline"
                  >
                    Voir tout <ArrowRight size={11} />
                  </button>
                </div>

                <div className="space-y-3">
                  {recentScans.map((s, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50"
                    >
                      <svg width="40" height="40" viewBox="0 0 40 40">
                        <circle cx="20" cy="20" r="17" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                        <circle
                          cx="20"
                          cy="20"
                          r="17"
                          fill="none"
                          stroke={scoreColor(s.score)}
                          strokeWidth="3"
                          strokeDasharray={`${(s.score / 100) * 107} 107`}
                          transform="rotate(-90 20 20)"
                        />
                        <text x="20" y="24" textAnchor="middle" fontSize="10" fill={scoreColor(s.score)}>
                          {s.score}
                        </text>
                      </svg>

                      <div className="flex-1">
                        <p className="text-sm font-medium">{s.site}</p>
                        <div className="flex gap-2 text-xs text-gray-400">
                          <Clock size={10} />
                          {s.date} • {s.vulns} vulnérabilités
                        </div>
                      </div>

                      <span className={`text-xs px-2 py-0.5 rounded border ${riskBadgeClass(s.risk)}`}>
                        {s.risk}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case "scan":
        return <Labs />;

      case "stats":
        return <Statistics />;

      case "settings":
        return <Settings />;

      default:
        return <div>Page non trouvée</div>;
    }
  };

  return (
    <div className="flex">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={handleLogout}
      />

      <main className="flex-1 ml-60 p-6 bg-gray-50 min-h-screen">
        {renderContent()}
      </main>
    </div>
  );
}