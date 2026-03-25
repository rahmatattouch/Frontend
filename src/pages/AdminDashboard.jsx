import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SidebarAdmin from "../components/SidebarAdmin";
import AdminUsers from "./AdminUsers";
import AdminAudits from "./AdminAudits";
import AdminSettings from "./AdminSettings";
import { ShieldCheck, ShieldAlert, Users, Activity, TrendingUp } from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell
} from "recharts";

export default function AdminDashboard() {
  const [activePage, setActivePage] = useState("dashboard");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  // --- Données ---
  const stats = [
    { label: "Audits Total", value: "1,284", change: "+12%", icon: ShieldCheck, color: "green" },
    { label: "Vulnérabilités", value: "347", change: "+5%", icon: ShieldAlert, color: "red" },
    { label: "Utilisateurs", value: "89", change: "+3", icon: Users, color: "green" },
    { label: "En cours", value: "14", change: "actifs", icon: Activity, color: "amber" },
  ];

  const lineData = [
    { day: "Lun", audits: 12, vulns: 4 },
    { day: "Mar", audits: 19, vulns: 7 },
    { day: "Mer", audits: 15, vulns: 3 },
    { day: "Jeu", audits: 27, vulns: 11 },
    { day: "Ven", audits: 22, vulns: 6 },
    { day: "Sam", audits: 9, vulns: 2 },
    { day: "Dim", audits: 18, vulns: 8 },
  ];

  const barData = [
    { name: "Jan", value: 40 },
    { name: "Fév", value: 68 },
    { name: "Mar", value: 55 },
    { name: "Avr", value: 91 },
    { name: "Mai", value: 73 },
    { name: "Jun", value: 110 },
  ];

  const pieData = [
    { name: "Critique", value: 18, color: "#ef4444" },
    { name: "Élevé", value: 35, color: "#f97316" },
    { name: "Moyen", value: 28, color: "#eab308" },
    { name: "Faible", value: 19, color: "#16a34a" },
  ];

  const recentAudits = [
    { site: "example.com", score: 82, risk: "Faible", status: "Terminé", date: "24/03/2026" },
    { site: "shop.tn", score: 41, risk: "Critique", status: "Terminé", date: "23/03/2026" },
    { site: "api.myapp.io", score: 67, risk: "Moyen", status: "En cours", date: "23/03/2026" },
    { site: "portal.corp.fr", score: 90, risk: "Faible", status: "Terminé", date: "22/03/2026" },
    { site: "beta.saas.co", score: 55, risk: "Élevé", status: "Terminé", date: "21/03/2026" },
  ];

  const riskBadge = (risk) => {
    const colors = {
      Critique: "bg-red-100 text-red-700 border-red-200",
      Élevé: "bg-orange-100 text-orange-700 border-orange-200",
      Moyen: "bg-yellow-100 text-yellow-700 border-yellow-200",
      Faible: "bg-green-100 text-green-700 border-green-200",
    };
    return colors[risk] || "bg-gray-100 text-gray-600";
  };

  const scoreColor = (s) => s >= 75 ? "#16a34a" : s >= 50 ? "#eab308" : "#ef4444";

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
            <p key={i} style={{ color: p.color }}>{p.name}: {p.value}</p>
          ))}
        </div>
      );
    }
    return null;
  };

  // ====== Render contenu selon page active ======
  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map(({ label, value, change, icon: Icon, color }) => (
                <div key={label} className="bg-white border border-gray-200 rounded-xl p-4 hover:border-green-300 hover:shadow-sm transition">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs text-gray-500">{label}</span>
                    <div className={`w-8 h-8 rounded-lg border flex items-center justify-center ${colorMap[color]}`}>
                      <Icon size={14} />
                    </div>
                  </div>
                  <p className="text-2xl font-semibold text-gray-900">{value}</p>
                  <p className={`text-xs mt-1 ${color === "red" ? "text-red-500" : "text-gray-400"}`}>
                    <TrendingUp size={10} className="inline mr-1" />
                    {change} ce mois
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
                    {pieData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
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

            {/* Bar chart + Recent audits */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="bg-white border border-gray-200 rounded-xl p-4">
                <p className="text-sm font-medium text-gray-900 mb-1">Audits par mois</p>
                <ResponsiveContainer width="100%" height={160}>
                  <BarChart data={barData} barSize={14}>
                    <XAxis dataKey="name" tick={{ fontSize: 11, fill: "#9ca3af" }} axisLine={false} tickLine={false} />
                    <YAxis hide />
                    <Tooltip content={<CustomTooltip />} />
                    <Bar dataKey="value" fill="#16a34a" opacity={0.8} radius={[3, 3, 0, 0]} name="Audits" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="lg:col-span-2 bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm font-medium text-gray-900">Derniers audits</p>
                  <button className="text-xs text-green-600 hover:underline">Voir tout →</button>
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
                              <div className="h-full rounded-full" style={{ width: `${a.score}%`, background: scoreColor(a.score) }} />
                            </div>
                            <span className="text-gray-600">{a.score}</span>
                          </div>
                        </td>
                        <td className="py-2.5">
                          <span className={`px-2 py-0.5 rounded-md border text-[11px] ${riskBadge(a.risk)}`}>{a.risk}</span>
                        </td>
                        <td className="py-2.5">
                          <span className={`text-[11px] ${a.status === "En cours" ? "text-amber-600" : "text-gray-400"}`}>
                            {a.status === "En cours" ? "● " : "○ "}{a.status}
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
      <SidebarAdmin
        activePage={activePage}
        setActivePage={setActivePage}
        onLogout={handleLogout}
      />
      <main className="flex-1 p-6 ml-60 space-y-6">
        {renderContent()}
      </main>
    </div>
  );
}