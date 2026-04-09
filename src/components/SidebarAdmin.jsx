import { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { LogOut, ShieldCheck, ShieldAlert, Users, Activity } from "lucide-react";

export default function SidebarAdmin({ activePage, setActivePage, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);

  // ✅ notifications counter
  const [unreadCount, setUnreadCount] = useState(0);

  // ---- DYNAMIQUE: lire user depuis localStorage ----
  const me = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }, []);

  const displayName = useMemo(() => {
    if (!me) return "Admin";
    const full = `${me.prenom || ""} ${me.nom || ""}`.trim();
    return full || me.email || "Admin";
  }, [me]);

  const displayEmail = me?.email || "—";

  const initials = useMemo(() => {
    const a = (me?.prenom || "").trim()[0] || "";
    const b = (me?.nom || "").trim()[0] || "";
    const init = (a + b).toUpperCase();
    return init || (displayEmail.trim()[0]?.toUpperCase() || "AD");
  }, [me, displayEmail]);

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: <ShieldCheck size={16} /> },
    { key: "users", label: "Utilisateurs", icon: <Users size={16} /> },
    { key: "audits", label: "Audits", icon: <ShieldAlert size={16} /> },
    { key: "settings", label: "Paramètres", icon: <Activity size={16} /> },
  ];

  // ✅ Fetch notifications periodically
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;

        const res = await axios.get("http://localhost:5000/api/admin/notifications", {
          headers: { Authorization: `Bearer ${token}` },
        });

        // si backend renvoie unreadCount
        if (typeof res.data?.unreadCount === "number") {
          setUnreadCount(res.data.unreadCount);
          return;
        }

        // fallback: calculer depuis notifications
        const items = res.data?.notifications || [];
        setUnreadCount(items.filter((n) => !n?.read).length);
      } catch {
        // ne casse pas la sidebar
      }
    };

    fetchNotifications();
    const t = setInterval(fetchNotifications, 15000); // refresh toutes les 15s
    return () => clearInterval(t);
  }, []);

  return (
    <aside
      className={`bg-white border-r border-gray-200 h-screen fixed transition-all duration-300 ${
        collapsed ? "w-20" : "w-60"
      }`}
    >
      {/* Toggle button */}
      <div className="flex justify-end p-2">
        <button
          className="text-gray-400 hover:text-gray-800"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? "→" : "←"}
        </button>
      </div>

      {/* Menu items */}
      <nav className="mt-4">
        {menuItems.map((item) => (
          <button
            key={item.key}
            onClick={() => setActivePage(item.key)}
            className={`flex items-center w-full p-3 gap-3 text-sm font-medium hover:bg-gray-100 transition ${
              activePage === item.key
                ? "bg-green-50 text-green-700 border-l-4 border-green-500"
                : "text-gray-700"
            }`}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Admin profile + logout */}
      <div
        className={`absolute bottom-0 w-full px-3 py-4 border-t border-gray-200 flex items-center gap-3 ${
          collapsed ? "justify-center" : ""
        }`}
      >
        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
          {initials}
        </div>

        {!collapsed && (
          <div className="flex-1 min-w-0">
            {/* ✅ Alerts badge ABOVE admin name */}
            {unreadCount > 0 ? (
              <div className="mb-1">
                <span className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-red-50 border border-red-200">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  <span className="text-[11px] font-semibold text-red-700">
                    {unreadCount} alerte{unreadCount > 1 ? "s" : ""}
                  </span>
                </span>
              </div>
            ) : null}

            <p className="text-xs font-medium text-gray-900 truncate">{displayName}</p>
            <p className="text-[11px] text-gray-400 truncate">{displayEmail}</p>
          </div>
        )}

        <button onClick={onLogout} className="text-gray-300 hover:text-red-500 transition">
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  );
}