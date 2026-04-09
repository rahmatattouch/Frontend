import { useState, useEffect, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import SidebarAdmin from "../components/SidebarAdmin";
import AdminUsers from "./AdminUsers";
import AdminAudits from "./AdminAudits";
import AdminSettings from "./AdminSettings";
import { ShieldCheck, ShieldAlert, Users, Activity, TrendingUp, Bell } from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import axios from "axios";

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // ---------- Helpers (risk + score) ----------
  const normalizeRiskLabel = (risk) => {
    const r = (risk ?? "").toString().trim().toLowerCase();
    if (r === "critical" || r === "critique") return "Critique";
    if (r === "high" || r === "élevé" || r === "eleve" || r === "éleve") return "Élevé";
    if (r === "medium" || r === "moyen") return "Moyen";
    if (r === "low" || r === "faible") return "Faible";
    return "Inconnu";
  };

  const normalizeScore = (s) => {
    const n = Number(s);
    if (!Number.isFinite(n)) return 0;
    if (n >= 0 && n <= 10) return Math.max(0, Math.min(100, Math.round(n * 10)));
    return Math.max(0, Math.min(100, Math.round(n)));
  };

  const scoreColor = (score) => {
    const s = normalizeScore(score);
    return s >= 75 ? "#16a34a" : s >= 50 ? "#eab308" : "#ef4444";
  };

  // ✅ AJOUT MINIMAL: ton code l'utilise dans setRecentAudits
  const toYYYYMMDD = (d) => {
    if (!d) return "—";
    const dt = new Date(d);
    if (Number.isNaN(dt.getTime())) return "—";
    return dt.toISOString().slice(0, 10);
  };

  const RISK_COLORS = useMemo(
    () => ({
      Critique: "#ef4444",
      "Élevé": "#f97316",
      Moyen: "#eab308",
      Faible: "#16a34a",
      Inconnu: "#9ca3af",
    }),
    []
  );

  const riskBadge = (risk) => {
    const normalized = normalizeRiskLabel(risk);
    const colors = {
      Critique: "bg-red-100 text-red-700 border-red-200",
      "Élevé": "bg-orange-100 text-orange-700 border-orange-200",
      Moyen: "bg-yellow-100 text-yellow-700 border-yellow-200",
      Faible: "bg-green-100 text-green-700 border-green-200",
      Inconnu: "bg-gray-100 text-gray-600 border-gray-200",
    };
    return colors[normalized] || colors.Inconnu;
  };

  // ---------- States dynamiques ----------
  const [stats, setStats] = useState([]);
  const [lineData, setLineData] = useState([]);
  const [barData, setBarData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [recentAudits, setRecentAudits] = useState([]);

  // ✅ Notifications admin (in-app)
  const [notifications, setNotifications] = useState([]);

  const unreadCount = useMemo(() => notifications.filter((n) => !n.read).length, [notifications]);

  const notifItemCls = (level) =>
    ({
      critical: "bg-red-50 border-red-200 text-red-700",
      warning: "bg-yellow-50 border-yellow-200 text-yellow-700",
      info: "bg-green-50 border-green-200 text-green-700",
    }[level] || "bg-gray-50 border-gray-200 text-gray-700");

  // ---------- Fetch dashboard ----------
  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/users/admin/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = res.data || {};

        const weekly = Array.isArray(data.auditsWeekly) ? data.auditsWeekly : [];
        const computedVulnsTotal = weekly.reduce((sum, d) => sum + (Number(d?.vulns) || 0), 0);

        const computedMonthly = (() => {
          if (Array.isArray(data.auditsMonthly) && data.auditsMonthly.length > 0) return data.auditsMonthly;
          const totalWeekAudits = weekly.reduce((sum, d) => sum + (Number(d?.audits) || 0), 0);
          const label = new Date().toLocaleDateString("fr-FR", { month: "short" });
          return [{ month: label, value: totalWeekAudits }];
        })();

        const computedRiskDistribution = (() => {
          const recent = Array.isArray(data.recentAudits) ? data.recentAudits : [];
          if (recent.length === 0) return [];
          const counts = recent.reduce((acc, a) => {
            const r = normalizeRiskLabel(a?.risk);
            acc[r] = (acc[r] || 0) + 1;
            return acc;
          }, {});
          return Object.entries(counts).map(([name, value]) => ({ name, value }));
        })();

        setStats([
          { label: "Audits Total", value: data.audits ?? 0, change: "", icon: ShieldCheck, color: "green" },
          {
            label: "Vulnérabilités",
            value: data.alerts && Number(data.alerts) > 0 ? data.alerts : computedVulnsTotal,
            change: "",
            icon: ShieldAlert,
            color: "red",
          },
          { label: "Utilisateurs", value: data.users ?? 0, change: "", icon: Users, color: "green" },
          { label: "En cours", value: data.auditsInProgress ?? 0, change: "actifs", icon: Activity, color: "amber" },
        ]);

        setLineData(weekly);
        setBarData(computedMonthly);

        const rawRisk =
          Array.isArray(data.riskDistribution) && data.riskDistribution.length > 0
            ? data.riskDistribution
            : computedRiskDistribution;

        const pie = rawRisk
          .map((r) => {
            const rawName = r?.name ?? r?._id;
            const name = normalizeRiskLabel(rawName);
            const value = Number(r?.value ?? r?.count ?? 0) || 0;
            return { name, value, color: RISK_COLORS[name] || "#9ca3af" };
          })
          .reduce((acc, cur) => {
            const found = acc.find((x) => x.name === cur.name);
            if (found) found.value += cur.value;
            else acc.push({ ...cur });
            return acc;
          }, [])
          .filter((x) => x.value > 0);

        const totalPie = pie.reduce((s, x) => s + x.value, 0) || 1;
        const piePct = pie.map((x) => ({ ...x, value: Math.round((x.value / totalPie) * 100) }));
        setPieData(piePct);

        // ✅ CORRECTION UNIQUEMENT ICI: recent audits robustes (site/score/risk/status/date)
        // - Ne dépend pas de "helpers" backend
        // - Supporte les variations: site/urlCible, status/statut, score/scoreGlobal/rapport.scoreGlobal
        const recent = Array.isArray(data.recentAudits) ? data.recentAudits : [];
        setRecentAudits(
          recent.map((a) => {
            const site = a?.site || a?.urlCible || a?.targetUrl || "—";
            const rawScore = a?.score ?? a?.scoreGlobal ?? a?.rapport?.scoreGlobal ?? 0;
            const risk = normalizeRiskLabel(a?.risk); // si backend le calcule => parfait, sinon "Inconnu"
            const status = a?.status || a?.statut || "—";
            const date = a?.date ? toYYYYMMDD(a.date) : "—";

            return { ...a, site, score: normalizeScore(rawScore), risk, status, date };
          })
        );
      } catch (err) {
        console.error("Erreur fetch dashboard:", err);
      }
    };

    fetchDashboard();
  }, [RISK_COLORS]);

  // ✅ Fetch notifications admin
  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/admin/notifications", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotifications(Array.isArray(res.data.notifications) ? res.data.notifications : []);
    } catch (err) {
      console.error("Erreur fetch notifications:", err);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const markNotifRead = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `http://localhost:5000/api/admin/notifications/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await fetchNotifications();
    } catch (err) {
      console.error("Erreur mark read:", err);
    }
  };

  // ---------- UI helpers ----------
  const colorMap = {
    green: "text-green-700 bg-green-50 border-green-200",
    red: "text-red-600 bg-red-50 border-red-200",
    amber: "text-amber-700 bg-amber-50 border-amber-200",
  };

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs shadow-sm">
          <p className="text-gray-500 mb-1">{label}</p>
          {payload.map((p, i) => (
            <p key={i} style={{ color: p.color }}>
              {p.name}: {p.value}
            </p>
          ))}
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
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map(({ label, value, change, icon: Icon, color }) => (
                <div
                  key={label}
                  className="bg-white border border-gray-200 rounded-xl p-4 hover:border-green-300 hover:shadow-sm transition"
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500">{label}</span>
                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${colorMap[color]}`}>
                      <Icon size={14} />
                    </div>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">{value}</p>
                  <p className={`text-xs mt-1 ${color === "red" ? "text-red-500" : "text-gray-400"}`}>
                    <TrendingUp size={10} className="inline mr-1" />
                    {change ? `${change} ce mois` : "—"}
                  </p>
                </div>
              ))}
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-900 mb-1">Activité hebdomadaire</p>
                <p className="text-xs text-gray-400 mb-4">Audits et vulnérabilités détectées</p>

                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={lineData}>
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <Tooltip content={<CustomTooltip />} />
                    <Line type="monotone" dataKey="audits" stroke="#16a34a" strokeWidth={2} dot={false} name="Audits" />
                    <Line type="monotone" dataKey="vulns" stroke="#ef4444" strokeWidth={2} dot={false} name="Vulnérabilités" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-900 mb-1">Niveaux de risque</p>
                <p className="text-xs text-gray-400 mb-4">Distribution des vulnérabilités</p>

                <PieChart width={150} height={150}>
                  <Pie data={pieData} cx={70} cy={70} innerRadius={45} outerRadius={68} dataKey="value" stroke="none">
                    {pieData.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>

                <div className="grid grid-cols-2 gap-x-4 gap-y-1.5 mt-2 w-full">
                  {pieData.map((d) => (
                    <div key={d.name} className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full shrink-0" style={{ background: d.color }} />
                      <span className="text-xs text-gray-500">{d.name}</span>
                      <span className="text-xs text-gray-400 ml-auto">{d.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bar chart + Alerts + Recent audits */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-900 mb-1">Audits par mois</p>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={barData} barSize={14}>
                    <XAxis dataKey="month" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#16a34a" opacity={0.8} radius={[3, 3, 0, 0]} name="Audits" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Alertes */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Bell size={14} className="text-gray-500" />
                    <p className="text-sm font-medium text-gray-900">Alertes récentes</p>
                  </div>
                  <span className="text-xs text-gray-400">{unreadCount} non lues</span>
                </div>

                <div className="space-y-2">
                  {notifications.length === 0 ? (
                    <div className="text-xs text-gray-400">Aucune notification</div>
                  ) : (
                    notifications.slice(0, 6).map((n) => (
                      <button
                        key={n._id}
                        type="button"
                        onClick={() => !n.read && markNotifRead(n._id)}
                        className={`w-full text-left flex items-start gap-3 p-3 rounded-lg border text-xs transition hover:opacity-90 ${notifItemCls(
                          n.level
                        )} ${n.read ? "opacity-70" : ""}`}
                        title={n.read ? "Lu" : "Cliquer pour marquer comme lu"}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full mt-0.5 ${
                            n.level === "critical"
                              ? "bg-red-500"
                              : n.level === "warning"
                                ? "bg-yellow-500"
                                : "bg-green-500"
                          }`}
                        />
                        <div className="flex-1">
                          <div className="font-medium">{n.title}</div>
                          <div className="mt-0.5">{n.message}</div>
                        </div>
                      </button>
                    ))
                  )}
                </div>

                <div className="mt-3 flex gap-2">
                  <button type="button" onClick={fetchNotifications} className="text-xs text-green-600 hover:underline">
                    Rafraîchir
                  </button>
                </div>
              </div>

              {/* Recent audits */}
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-gray-900">Derniers audits</p>
                  {/* ✅ on laisse ton comportement, juste une vraie navigation */}
                  <Link className="text-xs text-green-600 hover:underline" to="/AdminAudits">
                    Voir tout →
                  </Link>
                </div>

                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-100">
                      <th className="pb-2 text-left font-normal">Site</th>
                      <th className="pb-2 text-left font-normal">Score</th>
                      <th className="pb-2 text-left font-normal">Risque</th>
                      <th className="pb-2 text-left font-normal">Statut</th>
                      <th className="pb-2 text-left font-normal">Date</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-50">
                    {recentAudits.map((a, i) => (
                      <tr key={i} className="hover:bg-gray-50 transition">
                        <td className="py-2.5 text-gray-900 font-medium">{a.site}</td>

                        <td className="py-2.5">
                          <div className="flex items-center gap-2">
                            <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${a.score}%`,
                                  background: scoreColor(a.score),
                                }}
                              />
                            </div>
                            <span className="text-gray-600">{a.score}</span>
                          </div>
                        </td>

                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded-md border text-[11px] ${riskBadge(a.risk)}`}>
                            {a.risk}
                          </span>
                        </td>

                        <td className="py-2.5">
                          <span className={`text-[11px] ${a.status === "En cours" ? "text-amber-600" : "text-gray-400"}`}>
                            {a.status === "En cours" ? "● " : "○ "}
                            {a.status}
                          </span>
                        </td>

                        <td className="py-2.5 text-gray-400">{a.date}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );

      case "users":
        return <AdminUsers />;

      case "audits":
        return <AdminAudits />;

      case "settings":
        return <AdminSettings />;

      default:
        return <div>Page non trouvée</div>;
    }
  };

  return (
    <div className="flex">
      <SidebarAdmin activePage={activePage} setActivePage={setActivePage} onLogout={handleLogout} />
      <main className="flex-1 p-6 ml-60 space-y-6">{renderContent()}</main>
    </div>
  );
}