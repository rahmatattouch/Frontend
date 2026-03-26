import { useState, useEffect } from "react";
import { Search, UserPlus, MoreHorizontal, Shield, ShieldOff, Trash2 } from "lucide-react";
import { getAllUsers, deleteUser as deleteUserApi, updateUser, createUser } from "../services/authService";

const roleBadge = (role) => {
  const m = {
    admin: "bg-green-100 text-green-700 border border-green-200",
    user: "bg-gray-100 text-gray-600 border border-gray-200",
    Admin: "bg-green-100 text-green-700 border border-green-200",
    Utilisateur: "bg-gray-100 text-gray-600 border border-gray-200",
  };
  return m[role] || "";
};

const statusDot = (s) => {
  const m = { Actif: "bg-green-500", active: "bg-green-500", Inactif: "bg-gray-400", inactive: "bg-gray-400", Suspendu: "bg-red-500", suspended: "bg-red-500" };
  return m[s] || "bg-gray-400";
};

const statusText = (s) => {
  const m = { Actif: "text-green-700", active: "text-green-700", Inactif: "text-gray-400", inactive: "text-gray-400", Suspendu: "text-red-500", suspended: "text-red-500" };
  return m[s] || "text-gray-400";
};

const statusLabel = (s) => {
  const m = { active: "Actif", inactive: "Inactif", suspended: "Suspendu" };
  return m[s] || s;
};

const roleLabel = (r) => {
  const m = { admin: "Admin", user: "Utilisateur" };
  return m[r] || r;
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [filterRole, setFilterRole] = useState("Tous");
  const [openMenu, setOpenMenu] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [newUser, setNewUser] = useState({ name: "", email: "", role: "Utilisateur" });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await getAllUsers();
      setUsers(Array.isArray(data) ? data : data.users || []);
    } catch (err) {
      console.error("Erreur chargement utilisateurs:", err);
      setError("Impossible de charger les utilisateurs.");
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter((u) => {
    const name = u.name || `${u.prenom || ""} ${u.nom || ""}`.trim();
    const matchSearch =
      name.toLowerCase().includes(search.toLowerCase()) ||
      (u.email || "").toLowerCase().includes(search.toLowerCase());
    const role = roleLabel(u.role);
    const matchRole = filterRole === "Tous" || role === filterRole;
    return matchSearch && matchRole;
  });

  const handleDelete = async (id) => {
    try {
      await deleteUserApi(id);
      setUsers(users.filter((u) => (u._id || u.id) !== id));
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
    setOpenMenu(null);
  };

  const handleToggleStatus = async (u) => {
    const id = u._id || u.id;
    const newStatus = u.status === "active" || u.status === "Actif" ? "suspended" : "active";
    try {
      await updateUser(id, { status: newStatus });
      setUsers(users.map((usr) => (usr._id || usr.id) === id ? { ...usr, status: newStatus } : usr));
    } catch (err) {
      console.error("Erreur mise à jour statut:", err);
    }
    setOpenMenu(null);
  };

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email) return;
    try {
      const parts = newUser.name.trim().split(" ");
      const prenom = parts[0] || "";
      const nom = parts.slice(1).join(" ") || parts[0] || "";
      const created = await createUser({
        nom,
        prenom,
        email: newUser.email,
        role: newUser.role === "Admin" ? "admin" : "user",
        mdp: "ChangeMe123!",
      });
      setUsers([...users, created]);
    } catch (err) {
      console.error("Erreur création utilisateur:", err);
    }
    setNewUser({ name: "", email: "", role: "Utilisateur" });
    setShowModal(false);
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

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2 rounded-lg">{error}</div>
      )}

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
        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Chargement...</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-gray-400 text-xs bg-gray-50">
                <th className="text-left px-4 py-3 font-normal">Utilisateur</th>
                <th className="text-left px-4 py-3 font-normal">Rôle</th>
                <th className="text-left px-4 py-3 font-normal">Statut</th>
                <th className="text-left px-4 py-3 font-normal">Inscrit</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((u) => {
                const id = u._id || u.id;
                const name = u.name || `${u.prenom || ""} ${u.nom || ""}`.trim() || u.email;
                const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
                const role = roleLabel(u.role);
                const status = statusLabel(u.status);
                const joinedDate = u.createdAt ? new Date(u.createdAt).toLocaleDateString("fr-FR", { month: "short", year: "numeric" }) : u.joined || "—";
                return (
                  <tr key={id} className="hover:bg-gray-50 transition relative">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-semibold text-green-700 shrink-0">
                          {initials}
                        </div>
                        <div>
                          <p className="text-gray-900 font-medium text-sm">{name}</p>
                          <p className="text-xs text-gray-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`text-xs px-2 py-0.5 rounded-md ${roleBadge(u.role)}`}>{role}</span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-1.5 h-1.5 rounded-full ${statusDot(u.status)}`} />
                        <span className={`text-xs ${statusText(u.status)}`}>{status}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-gray-400 text-xs">{joinedDate}</td>
                    <td className="px-4 py-3 relative">
                      <button
                        onClick={() => setOpenMenu(openMenu === id ? null : id)}
                        className="text-gray-300 hover:text-gray-600 transition p-1 rounded"
                      >
                        <MoreHorizontal size={16} />
                      </button>
                      {openMenu === id && (
                        <div className="absolute right-4 top-10 z-20 bg-white border border-gray-200 rounded-lg shadow-lg overflow-hidden w-44">
                          <button
                            onClick={() => handleToggleStatus(u)}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-xs text-gray-600 hover:bg-gray-50 transition"
                          >
                            {u.status === "active" || u.status === "Actif" ? <ShieldOff size={13} /> : <Shield size={13} />}
                            {u.status === "active" || u.status === "Actif" ? "Suspendre" : "Activer"}
                          </button>
                          <button
                            onClick={() => handleDelete(id)}
                            className="flex items-center gap-2 w-full px-4 py-2.5 text-xs text-red-500 hover:bg-red-50 transition"
                          >
                            <Trash2 size={13} />
                            Supprimer
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
        {!loading && filtered.length === 0 && (
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
              <button onClick={handleCreateUser} className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2 rounded-lg transition">
                Créer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}