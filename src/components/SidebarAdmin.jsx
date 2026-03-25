import { useState } from "react";
import { LogOut, ShieldCheck, ShieldAlert, Users, Activity } from "lucide-react";

export default function SidebarAdmin({ activePage, setActivePage, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    { key: "dashboard", label: "Dashboard", icon: <ShieldCheck size={16} /> },
    { key: "users", label: "Utilisateurs", icon: <Users size={16} /> },
    { key: "audits", label: "Audits", icon: <ShieldAlert size={16} /> },
    { key: "settings", label: "Paramètres", icon: <Activity size={16} /> },
  ];

  return (
    <aside className={`bg-white border-r border-gray-200 h-screen fixed transition-all duration-300 ${collapsed ? "w-20" : "w-60"}`}>
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
              activePage === item.key ? "bg-green-50 text-green-700 border-l-4 border-green-500" : "text-gray-700"
            }`}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* Admin profile + logout */}
      <div className={`absolute bottom-0 w-full px-3 py-4 border-t border-gray-200 flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 rounded-full bg-green-600 flex items-center justify-center text-xs font-bold text-white shrink-0">
          AD
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">Admin</p>
            <p className="text-[11px] text-gray-400 truncate">admin@gmail.com</p>
          </div>
        )}
        <button
          onClick={onLogout}
          className="text-gray-300 hover:text-red-500 transition"
        >
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  );
}