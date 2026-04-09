import { useState, useEffect } from "react";
import {
  LayoutDashboard, ScanSearch, BarChart2,
  Settings, LogOut, Menu, X, ShieldCheck, Bell
} from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { getAlerts } from "../services/dashboardService";

const navItems = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { id: "scan",      label: "Nouveau Scan", icon: ScanSearch },
  { id: "stats",     label: "Statistiques", icon: BarChart2 },
  { id: "settings",  label: "Paramètres", icon: Settings },
];

export default function Sidebar({ activePage, setActivePage, onLogout }) {
  const { user, isAuthenticated } = useAuth(); // ✅ données user depuis le contexte
  const [collapsed, setCollapsed] = useState(false);
  const [alerts, setAlerts] = useState({ count: 0, messages: [] });
  const [loadingAlerts, setLoadingAlerts] = useState(true);

  useEffect(() => {
    if (!isAuthenticated) return;

    async function fetchAlerts() {
      try {
        setLoadingAlerts(true);
        const a = await getAlerts();
        setAlerts(a || { count: 0, messages: [] });
      } catch (err) {
        console.error("Sidebar alerts error:", err.message);
        setAlerts({ count: 0, messages: [] });
      } finally {
        setLoadingAlerts(false);
      }
    }

    fetchAlerts();
  }, [isAuthenticated]);

  // ✅ Données user directement depuis AuthContext, pas de fetch supplémentaire
  const firstName = user?.prenom || user?.firstName || "U";
  const lastName  = user?.nom    || user?.lastName  || "";
  const email     = user?.email  || "";

  return (
    <aside className={`fixed h-screen flex flex-col bg-white border-r border-gray-200 transition-all duration-300 ${
      collapsed ? "w-16" : "w-60"
    }`}>
      {/* Logo + Collapse */}
      <div className="flex items-center justify-between px-4 py-5 border-b">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-green-600 rounded-md flex items-center justify-center">
              <ShieldCheck size={15} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900">SecureAudit</span>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <Menu size={18} /> : <X size={16} />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1">
        {navItems.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActivePage(id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
              activePage === id
                ? "bg-green-50 text-green-700 border border-green-200 font-medium"
                : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
            }`}
          >
            <Icon size={16} />
            {!collapsed && <span>{label}</span>}
          </button>
        ))}
      </nav>

      {/* Alerts 
      {!collapsed && (
        <div className="mx-3 mb-3 bg-green-50 border border-green-200 rounded-xl p-3">
          <div className="flex items-center gap-2 mb-1">
            <Bell size={13} className="text-green-600" />
            <span className="text-xs font-medium text-green-700">
              {loadingAlerts ? "..." : `${alerts.count || 0} alertes`}
            </span>
          </div>
          {loadingAlerts ? (
            <p className="text-[11px] text-green-600">Chargement...</p>
          ) : alerts.messages?.length > 0 ? (
            <div className="max-h-16 overflow-y-auto">
              {alerts.messages.map((msg, idx) => (
                <p key={idx} className="text-[11px] text-green-600 truncate">{msg}</p>
              ))}
            </div>
          ) : (
            <p className="text-[11px] text-green-600">Aucune alerte</p>
          )}
        </div>
      )}
*/}
      {/* User */}
      <div className="px-3 py-4 border-t flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-semibold text-green-700">
          {firstName[0]}{lastName[0]}
        </div>
        {!collapsed && (
          <>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-medium text-gray-900 truncate">
                {`${firstName} ${lastName}`.trim() || "Utilisateur"}
              </p>
              <p className="text-[11px] text-gray-400 truncate">
                {email || "user@corp.fr"}
              </p>
            </div>
            <button onClick={onLogout} className="text-gray-300 hover:text-red-500 transition">
              <LogOut size={15} />
            </button>
          </>
        )}
      </div>
    </aside>
  );
}