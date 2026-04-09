import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import * as dashboardService from "../services/dashboardService";
import Labs from "./Labs";
import Statistics from "./Statistics";
import Settings from "./Settings";

import {
  ShieldCheck,
  ShieldAlert,
  ScanSearch,
  TrendingUp,
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
  const [stats, setStats] = useState({});
  const [scans, setScans] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
const { token, loading: authLoading } = useAuth();
  useEffect(() => {
  if (authLoading || !token) return; // 🔥 أهم سطر

  const fetchData = async () => {
    try {
      const [statsRes, scansRes, alertsRes, chartRes] = await Promise.all([
        dashboardService.getStats(),
        dashboardService.getRecentScans(),
        dashboardService.getAlerts(),
        dashboardService.getScoreEvolution(),
      ]);

      setStats(statsRes.data ?? statsRes);
      setScans(scansRes.data ?? scansRes);
      setAlerts(alertsRes.data ?? alertsRes);
      setChartData(chartRes.data ?? chartRes);
    } catch (err) {
      console.error("Erreur dashboard:", err);
      setError("Impossible de charger le dashboard. Vérifiez que le serveur est lancé.");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [token, authLoading]); 

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <p className="text-gray-500 text-sm">Chargement...</p>
      </div>
    );

  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl px-6 py-4 text-sm max-w-md text-center">
          {error}
        </div>
      </div>
    );

  const myStats = [
    { label: "Mes Scans",       value: stats.totalScans     ?? stats.scans         ?? 0, icon: ScanSearch  },
    { label: "Vulnérabilités",  value: stats.vulnerabilities ?? 0,                        icon: ShieldAlert },
    { label: "Sites sécurisés", value: stats.secureSites    ?? stats.secured        ?? 0, icon: ShieldCheck },
    { label: "Score moyen",     value: stats.riskScore      ?? stats.score          ?? 0, icon: TrendingUp  },
  ];

  const scoreColor = (s) =>
    s >= 75 ? "#16a34a" : s >= 50 ? "#eab308" : "#ef4444";

  const riskBadgeClass = (risk) =>
    ({
      Critique: "bg-red-100 text-red-700 border-red-200",
      Élevé:    "bg-orange-100 text-orange-700 border-orange-200",
      Moyen:    "bg-yellow-100 text-yellow-700 border-yellow-200",
      Faible:   "bg-green-100 text-green-700 border-green-200",
    }[risk] ?? "bg-gray-100 text-gray-600");

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
                <p className="text-sm text-gray-500">Voici votre dashboard</p>
              </div>
              <button
                onClick={() => setActivePage("scan")}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition"
              >
                <ScanSearch size={14} />
                Lancer un scan
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {myStats.map(({ label, value, icon: Icon }) => (
                <div key={label} className="bg-white border rounded-xl p-4">
                  <div className="flex justify-between mb-2">
                    <span className="text-xs text-gray-500">{label}</span>
                    <Icon size={14} className="text-gray-400" />
                  </div>
                  <p className="text-xl font-semibold">{value}</p>
                </div>
              ))}
            </div>

            {/* Chart */}
            <div className="bg-white border rounded-xl p-4">
              <p className="text-sm font-medium mb-4">Évolution du score</p>
              {chartData.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-8">Aucune donnée disponible</p>
              ) : (
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={chartData}>
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="score"
                      stroke="#16a34a"
                      strokeWidth={2}
                      dot={{ r: 3 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Alerts + Scans */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

              {/* Alerts */}
              <div className="bg-white border rounded-xl p-4 space-y-3">
                <p className="text-sm font-medium text-gray-900">Alertes récentes</p>
                {alerts.length === 0 ? (
                  <p className="text-xs text-gray-400">Aucune alerte</p>
                ) : (
                  alerts.map((a, i) => (
                    <div
                      key={i}
                      className={`p-3 border rounded-lg text-xs font-medium ${riskBadgeClass(a.level)}`}
                    >
                      {a.message}
                    </div>
                  ))
                )}
              </div>

              {/* Scans */}
              <div className="lg:col-span-2 bg-white border rounded-xl p-4">
                <p className="text-sm font-medium mb-4">Derniers scans</p>
                {scans.length === 0 ? (
                  <p className="text-xs text-gray-400">Aucun scan effectué</p>
                ) : (
                  <div className="divide-y">
                    {scans.map((s, i) => (
                      <div key={s._id ?? i} className="flex justify-between items-center py-2 text-sm">
                        <span className="text-gray-700 truncate max-w-[60%]">{s.url}</span>
                        <span
                          className="font-semibold text-sm"
                          style={{ color: scoreColor(s.score) }}
                        >
                          {s.score}/100
                        </span>
                      </div>
                    ))}
                  </div>
                )}
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
        return <div className="text-gray-500 text-sm">Page non trouvée</div>;
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
