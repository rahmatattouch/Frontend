import { useState } from "react";
import { LogOut, ShieldCheck, ShieldAlert, Users, Activity, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const menuItems = [
  { key: "dashboard", label: "Dashboard",      icon: ShieldCheck },
  { key: "users",     label: "Utilisateurs",   icon: Users },
  { key: "audits",    label: "Audits",          icon: ShieldAlert },
  { key: "settings",  label: "Paramètres",      icon: Activity },
];

export default function SidebarAdmin({ activePage, setActivePage, onLogout }) {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();

  const fullName = user
    ? (`${user.prenom ?? ""} ${user.nom ?? ""}`.trim() || user.name || user.email)
    : "Admin";
  const email = user?.email ?? "";
  const initials = fullName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "AD";

  return (
    <aside className={`bg-white border-r border-gray-200 h-screen fixed transition-all duration-300 ${collapsed ? "w-16" : "w-60"}`}>
      {/* Logo + toggle */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-gray-200">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-green-600 rounded-md flex items-center justify-center">
              <ShieldCheck size={15} className="text-white" />
            </div>
            <span className="text-sm font-semibold text-gray-900">SecureAudit</span>
          </div>
        )}
        <button
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
          className="text-gray-400 hover:text-gray-800"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? <Menu size={18} /> : <X size={16} />}
        </button>
      </div>

      {/* Menu items */}
      <nav className="mt-2 px-2 space-y-1">
        {menuItems.map((item) => {
          const ItemIcon = item.icon;
          return (
            <button
              key={item.key}
              onClick={() => setActivePage(item.key)}
              aria-current={activePage === item.key ? "page" : undefined}
              className={`flex items-center w-full px-3 py-2.5 gap-3 text-sm rounded-lg transition ${
                activePage === item.key
                  ? "bg-green-50 text-green-700 border border-green-200 font-medium"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <ItemIcon size={16} className="shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Admin profile + logout */}
      <div className={`absolute bottom-0 w-full px-3 py-4 border-t border-gray-200 flex items-center gap-3 ${collapsed ? "justify-center" : ""}`}>
        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-semibold text-green-700 shrink-0">
          {initials}
        </div>
        {!collapsed && (
          <div className="flex-1 min-w-0">
            <p className="text-xs font-medium text-gray-900 truncate">{fullName}</p>
            <p className="text-[11px] text-gray-400 truncate">{email}</p>
          </div>
        )}
        <button
          onClick={onLogout}
          aria-label="Se déconnecter"
          className="text-gray-300 hover:text-red-500 transition"
        >
          <LogOut size={15} />
        </button>
      </div>
    </aside>
  );
}