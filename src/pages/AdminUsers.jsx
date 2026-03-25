import { useState } from "react";
import { Search, UserPlus, MoreHorizontal, Shield, ShieldOff, Trash2 } from "lucide-react";

const initialUsers = [
  { id: 1, name: "Ahmed Ben Ali", email: "ahmed@ithouse.tn", role: "Admin", status: "Actif", audits: 42, joined: "Jan 2026" },
  { id: 2, name: "Sonia Trabelsi", email: "sonia@corp.fr", role: "Utilisateur", status: "Actif", audits: 18, joined: "Fév 2026" },
  { id: 3, name: "Mehdi Chaari", email: "mehdi@saas.io", role: "Utilisateur", status: "Inactif", audits: 7, joined: "Mar 2026" },
  { id: 4, name: "Fatma Jlassi", email: "fatma@startup.tn", role: "Utilisateur", status: "Actif", audits: 31, joined: "Jan 2026" },
  { id: 5, name: "Karim Nasri", email: "karim@gov.tn", role: "Utilisateur", status: "Actif", audits: 5, joined: "Mar 2026" },
  { id: 6, name: "Lina Bouaziz", email: "lina@edu.tn", role: "Utilisateur", status: "Suspendu", audits: 0, joined: "Fév 2026" },
];

const roleBadge = (role) => {
  const m = {
    Admin: "bg-green-100 text-green-700 border border-green-200",
    Utilisateur: "bg-gray-100 text-gray-600 border border-gray-200",
  };
  return m[role] || "";
};

const statusDot = (s) => {
  const m = { Actif: "bg-green-500", Inactif: "bg-gray-400", Suspendu: "bg-red-500" };
  return m[s] || "bg-gray-400";
};

const statusText = (s) => {
  const m = { Actif: "text-green-700", Inactif: "text-gray-400", Suspendu: "text-red-500" };
  return m[s] || "text-gray-400";
};

export default function AdminUsers() {
  const [users, setUsers] = useState(initialUsers);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("Tous");
  const [openMenu, setOpenMenu] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Utilisateur" });

  const filtered = users.filter((u) => {
    const matchSearch =
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === "Tous" || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const addUser = () => {
    if (!newUser.name || !newUser.email) return;
    setUsers([...users, { id: users.length + 1, ...newUser, status: "Actif", audits: 0, joined: "Mar 2026" }]);
    setNewUser({ name: "", email: "", role: "Utilisateur" });
    setShowModal(false);
  };

  const deleteUser = (id) => { setUsers(users.filter((u) => u.id !== id)); setOpenMenu(null); };
  const toggleStatus = (id) => {
    setUsers(users.map((u) => u.id === id ? { ...u, status: u.status === "Actif" ? "Suspendu" : "Actif" } : u));
    setOpenMenu(null);
  };

  const inputCls = "w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition";

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Utilisateurs</h1>
          <p className="text-sm text-gray-500 mt-0.5">{users.length} comptes enregistrés</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition shadow-sm"
        >
          <UserPlus size={15} />
          Ajouter
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition"
          />
        </div>
        {["Tous", "Admin", "Utilisateur"].map((r) => (
          <button
            key={r}
            onClick={() => setFilterRole(r)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition ${
              filterRole === r
                ? "bg-green-50 text-green-700 border-green-300 font-medium"
                : "border-gray-200 text-gray-500 hover:text-gray-700 bg-white"
            }`}
          >
            {r}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100 text-gray-400 text-xs bg-gray-50">
              <th className="text-left px-4 py-3 font-normal">Utilisateur</th>
              <th className="text-left px-4 py-3 font-normal">Rôle</th>
              <th className="text-left px-4 py-3 font-normal">Statut</th>
              <th className="text-left px-4 py-3 font-normal">Audits</th>
              <th className="text-left px-4 py-3 font-normal">Inscrit</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((u) => (
              <tr key={u.id} className="hover:bg-gray-50 transition relative">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-semibold text-green-700 shrink-0">
                      {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-gray-900 font-medium text-sm">{u.name}</p>
                      <p className="text-xs text-gray-400">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-md ${roleBadge(u.role)}`}>{u.role}</span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-1.5 h-1.5 rounded-full ${statusDot(u.status)}`} />
                    <span className={`text-xs ${statusText(u.status)}`}>{u.status}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-700 text-sm">{u.audits}</td>
                <td className="px-4 py-3 text-gray-400 text-xs">{u.joined}</td>
                <td className="px-4 py-3 relative">
                  <button
                    onClick={() => setOpenMenu(openMenu === u.id ? null : u.id)}
                    className="text-gray-300 hover:text-gray-600 transition p-1 rounded"
                  >
                    <MoreHorizontal size={16} />
                  </button>
                  {openMenu === u.id && (
                    <div className="absolute right-4 top-10 z-20 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden w-44">
                      <button
                        onClick={() => toggleStatus(u.id)}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-xs text-gray-600 hover:bg-gray-50 transition"
                      >
                        {u.status === "Actif" ? <ShieldOff size={13} /> : <Shield size={13} />}
                        {u.status === "Actif" ? "Suspendre" : "Activer"}
                      </button>
                      <button
                        onClick={() => deleteUser(u.id)}
                        className="flex items-center gap-2 w-full px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 transition"
                      >
                        <Trash2 size={13} />
                        Supprimer
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">Aucun utilisateur trouvé</div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white border border-gray-200 rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Nouvel utilisateur</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Nom complet</label>
                <input type="text" value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} placeholder="Ex: Ahmed Ben Ali" className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Email</label>
                <input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} placeholder="email@exemple.com" className={inputCls} />
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1.5 block">Rôle</label>
                <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className={inputCls}>
                  <option>Utilisateur</option>
                  <option>Admin</option>
                </select>
              </div>
            </div>
            <div className="flex gap-3 mt-5">
              <button onClick={() => setShowModal(false)} className="flex-1 border border-gray-200 text-gray-500 text-sm py-2 rounded-lg hover:bg-gray-50 transition">
                Annuler
              </button>
              <button onClick={addUser} className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-lg transition">
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}