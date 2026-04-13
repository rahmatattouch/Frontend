import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import { useAuth } from "../context/AuthContext";
import * as dashboardService from "../services/dashboardService";
import Labs from "./Labs";
import Statistics from "./Statistics";
import Settings from "./Settings";

import { ShieldCheck, ShieldAlert, ScanSearch, TrendingUp } from "lucide-react";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function ClientDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const [stats, setStats] = useState({});
  const [scans, setScans] = useState([]);
  const [alerts, setAlerts] = useState([]); // alerts from backend: [{_id, level, message, read, ...}]
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  // ✅ useAuth only once (avoid double calls / inconsistent values)
  const { user, logout, token, loading: authLoading } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  // ✅ Respect Settings toggle (Notifications tab)
  const alertsEnabled = user?.notifications?.inAppAlerts ?? true;

  useEffect(() => {
    if (authLoading) return;

    // if no token -> redirect to login
    if (!token) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsRes, scansRes, alertsRes, chartRes] = await Promise.all([
          dashboardService.getStats(),
          dashboardService.getRecentScans(),
          dashboardService.getAlerts(), // ✅ should call /api/alerts (not /api/dashboard/alerts)
          dashboardService.getScoreEvolution(),
        ]);

        setStats(statsRes?.data ?? statsRes ?? {});
        setScans(scansRes?.data ?? scansRes ?? []);

        // ✅ getAlerts() returns {data: [...]}
        const rawAlerts = alertsRes?.data ?? alertsRes ?? [];
        setAlerts(Array.isArray(rawAlerts) ? rawAlerts : []);

        setChartData(chartRes?.data ?? chartRes ?? []);
      } catch (err) {
        console.error("Erreur dashboard:", err);
        setError("Impossible de charger le dashboard. Vérifiez que le serveur est lancé.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token, authLoading, navigate]);

  // ✅ unreadCount from DB (read:false). If alerts disabled => 0
  const unreadCount = useMemo(() => {
    if (!alertsEnabled) return 0;
    return (alerts || []).filter((a) => a && a.read === false).length;
  }, [alerts, alertsEnabled]);

  // ✅ click => mark read in DB + optimistic UI
  const handleAlertClick = async (alert) => {
    if (!alertsEnabled) return;
    if (!alert?._id) return;
    if (alert.read) return;

    // optimistic update
    setAlerts((prev) => prev.map((a) => (a?._id === alert._id ? { ...a, read: true } : a)));

    try {
      await dashboardService.markAlertRead(alert._id);
    } catch (e) {
      // rollback on failure
      setAlerts((prev) => prev.map((a) => (a?._id === alert._id ? { ...a, read: false } : a)));
    }
  };

  const myStats = useMemo(
    () => [
      { label: "Mes Scans", value: stats.totalScans ?? stats.scans ?? 0, icon: ScanSearch },
      { label: "Vulnérabilités", value: stats.vulnerabilities ?? 0, icon: ShieldAlert },
      { label: "Sites sécurisés", value: stats.secureSites ?? stats.secured ?? 0, icon: ShieldCheck },
      { label: "Score moyen", value: stats.riskScore ?? stats.score ?? 0, icon: TrendingUp },
    ],
    [stats]
  );

  // ✅ "new user" detection (no scans, no alerts, no chart)
  const isNewUser = useMemo(() => {
    const totalScans = stats.totalScans ?? stats.scans ?? 0;
    return (
      Number(totalScans) === 0 &&
      (scans?.length ?? 0) === 0 &&
      (alerts?.length ?? 0) === 0 &&
      (chartData?.length ?? 0) === 0
    );
  }, [stats, scans, alerts, chartData]);

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

  const scoreColor = (s) => (s >= 75 ? "#16a34a" : s >= 50 ? "#eab308" : "#ef4444");

  const riskBadgeClass = (risk) =>
    ({
      Critique: "bg-red-100 text-red-700 border-red-200",
      Élevé: "bg-orange-100 text-orange-700 border-orange-200",
      Moyen: "bg-yellow-100 text-yellow-700 border-yellow-200",
      Faible: "bg-green-100 text-green-700 border-green-200",
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
                  Bonjour {user?.prenom || user?.name || "Utilisateur"} 👋
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

            {/* ✅ Pro onboarding / guide nouveau user (Tailwind avancé) */}
            {isNewUser && (
              <div className="relative overflow-hidden rounded-2xl border border-emerald-200 bg-gradient-to-br from-emerald-50 via-white to-green-50 p-5 shadow-sm">
                {/* background decoration */}
                <div className="pointer-events-none absolute -top-20 -right-20 h-56 w-56 rounded-full bg-emerald-200/40 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-24 -left-24 h-56 w-56 rounded-full bg-green-200/40 blur-3xl" />
                <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(16,185,129,0.12)_1px,transparent_1px)] [background-size:18px_18px] opacity-70" />

                <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                  <div className="min-w-0">
                    <div className="inline-flex items-center gap-2 rounded-full border border-emerald-200 bg-white/70 px-3 py-1 text-[11px] font-semibold text-emerald-700 backdrop-blur">
                      <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.12)]" />
                      Onboarding — nouveau compte
                    </div>

                    <h2 className="mt-2 text-lg font-semibold tracking-tight text-gray-900">
                      Bienvenue sur SecureAudit
                    </h2>
                    <p className="mt-1 text-sm text-gray-600">
                      Lance ton <span className="font-semibold text-gray-900">premier scan</span> pour générer ton score,
                      tes alertes et tes rapports.
                    </p>

                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="rounded-xl border border-emerald-100 bg-white/70 p-3 backdrop-blur">
                        <p className="text-xs font-semibold text-gray-900">1) Scan</p>
                        <p className="mt-1 text-[12px] text-gray-600">
                          Analyse HTTP/HTTPS + détection vulnérabilités.
                        </p>
                      </div>

                      <div className="rounded-xl border border-emerald-100 bg-white/70 p-3 backdrop-blur">
                        <p className="text-xs font-semibold text-gray-900">2) Alertes</p>
                        <p className="mt-1 text-[12px] text-gray-600">
                          Clique pour marquer “lu” et réduire le badge.
                        </p>
                      </div>

                      <div className="rounded-xl border border-emerald-100 bg-white/70 p-3 backdrop-blur">
                        <p className="text-xs font-semibold text-gray-900">3) Notifications</p>
                        <p className="mt-1 text-[12px] text-gray-600">
                          Active/désactive email & in-app dans Paramètres.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2 lg:min-w-[240px]">
                    <button
                      type="button"
                      onClick={() => setActivePage("scan")}
                      className="group inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 ring-1 ring-emerald-600/20 transition hover:bg-emerald-700 hover:shadow-emerald-700/25 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
                    >
                      <ScanSearch size={16} className="opacity-95" />
                      Lancer mon premier scan
                      <span className="transition-transform group-hover:translate-x-0.5">→</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setActivePage("settings")}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-gray-800 backdrop-blur transition hover:bg-white"
                    >
                      Paramètres
                    </button>

                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      Astuce: teste avec <span className="font-semibold text-gray-700">example.com</span> pour vérifier le
                      fonctionnement.
                    </p>
                  </div>
                </div>
              </div>
            )}

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
                    <Line type="monotone" dataKey="score" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>

            {/* Alerts + Scans */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              {/* Alerts */}
              <div className="bg-white border rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium text-gray-900">Alertes récentes</p>
                  <span className="text-xs text-gray-400">
                    {alertsEnabled ? `${unreadCount} non lue(s)` : "Désactivées"}
                  </span>
                </div>

                {!alertsEnabled ? (
                  <p className="text-xs text-gray-400">
                    Notifications in-app désactivées (Paramètres → Notifications).
                  </p>
                ) : alerts.length === 0 ? (
                  <p className="text-xs text-gray-400">Aucune alerte</p>
                ) : (
                  alerts.map((a, i) => (
                    <button
                      key={a?._id ?? i}
                      type="button"
                      onClick={() => handleAlertClick(a)}
                      className={`w-full text-left p-3 border rounded-lg text-xs font-medium transition hover:opacity-90 ${
                        riskBadgeClass(a?.level)
                      } ${a?.read ? "opacity-60" : ""}`}
                      title={a?.read ? "Déjà lue" : "Cliquer pour marquer comme lue"}
                    >
                      {a?.message || a?.title || "Alerte"}
                      {!a?.read && <span className="ml-2 text-[10px] text-gray-500">(nouvelle)</span>}
                    </button>
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
                        <span className="font-semibold text-sm" style={{ color: scoreColor(s.score) }}>
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
        alertsCount={unreadCount} // ✅ badge = unread
        alertsEnabled={alertsEnabled}
      />
      <main className="flex-1 ml-60 p-6 bg-gray-50 min-h-screen">{renderContent()}</main>
    </div>
  );
}