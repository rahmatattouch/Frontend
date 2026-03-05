import React, { useState, useEffect } from 'react';
import authService from '../services/authService';
import { useNavigate } from "react-router-dom";
const AdminDashboard = () => {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError('');
      const allUsers = await authService.getAllUsers();
      setUsers(allUsers);
    } catch (err) {
      setError('Erreur lors du chargement des utilisateurs');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user._id);
    setEditFormData({ nom: user.nom, prenom: user.prenom, email: user.email });
  };

  const handleCancelEdit = () => {
    setEditingUser(null);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (userId) => {
    try {
      await authService.updateUser(userId, editFormData);
      setUsers(users.map(u => u._id === userId ? { ...u, ...editFormData } : u));
      setEditingUser(null);
    } catch (err) {
      setError('Erreur lors de la mise à jour');
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Supprimer cet utilisateur ?')) {
      try {
        await authService.deleteUser(userId);
        setUsers(users.filter(u => u._id !== userId));
      } catch (err) {
        setError('Erreur suppression');
      }
    }
  };
  

 return (

<div className="flex min-h-screen bg-gray-100">

{/* SIDEBAR */}

<aside className="w-64 bg-white shadow-xl border-r">

<div className="p-6 border-b">

<h2 className="text-2xl font-bold text-green-600">
SecureLab
</h2>

<p className="text-sm text-gray-500">
Admin Panel
</p>

</div>

<nav className="p-4 space-y-2">

<a className="flex items-center gap-2 px-4 py-2 bg-green-50 text-green-600 rounded-lg font-medium">
 Dashboard
</a>

<a className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
 Utilisateurs
</a>

<a className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
 Rapports
</a>

<a className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 rounded-lg">
 Paramètres
</a>

</nav>

</aside>


{/* MAIN CONTENT */}

<main className="flex-1 p-10">


<div className="mb-8 flex justify-between items-center">

<div>
<h1 className="text-4xl font-extrabold text-green-600 mb-1">
Tableau de Bord Administrateur
</h1>
<p className="text-gray-600">
Gérez les utilisateurs et surveillez la plateforme
</p>
</div>

<button
onClick={() => navigate("/users")}
className="bg-green-600 text-white px-5 py-2 rounded-lg hover:bg-green-700 shadow-md transition"
>
 Voir les utilisateurs
</button>

</div>


{/* STATS */}

<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">

<div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">

<p className="text-gray-500 text-sm">Total Utilisateurs</p>

<p className="text-3xl font-bold text-gray-800">
{users.length}
</p>

</div>

<div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">

<p className="text-gray-500 text-sm">Utilisateurs</p>

<p className="text-3xl font-bold text-gray-800">
{users.filter(u => u.role === "user").length}
</p>

</div>

<div className="bg-white p-6 rounded-xl shadow hover:shadow-lg transition">

<p className="text-gray-500 text-sm">Administrateurs</p>

<p className="text-3xl font-bold text-gray-800">
{users.filter(u => u.role === "admin").length}
</p>

</div>

</div>


{/* SEARCH BAR */}

<div className="bg-white p-4 rounded-xl shadow mb-6 flex justify-between items-center">

<input
type="text"
placeholder="🔍 Rechercher un utilisateur..."
className="border rounded-lg px-4 py-2 w-80 focus:ring-2 focus:ring-green-500 outline-none"
/>

</div>


{/* TABLE */}

<div className="bg-white rounded-xl shadow overflow-hidden">

<table className="min-w-full text-sm">

<thead className="bg-gray-50 text-gray-600">

<tr>

<th className="px-6 py-3 text-left">Nom</th>
<th className="px-6 py-3 text-left">Prénom</th>
<th className="px-6 py-3 text-left">Email</th>
<th className="px-6 py-3 text-left">Date</th>
<th className="px-6 py-3 text-left">Actions</th>

</tr>

</thead>

<tbody className="divide-y">

{users.map(user => (

<tr key={user._id} className="hover:bg-gray-50 transition">

<td className="px-6 py-3">

{editingUser === user._id ? (

<input
name="nom"
value={editFormData.nom}
onChange={handleEditChange}
className="border rounded px-2 py-1"
/>

) : user.nom}

</td>


<td className="px-6 py-3">

{editingUser === user._id ? (

<input
name="prenom"
value={editFormData.prenom}
onChange={handleEditChange}
className="border rounded px-2 py-1"
/>

) : user.prenom}

</td>


<td className="px-6 py-3 text-gray-600">

{editingUser === user._id ? (

<input
name="email"
value={editFormData.email}
onChange={handleEditChange}
className="border rounded px-2 py-1"
/>

) : user.email}

</td>


<td className="px-6 py-3 text-gray-500">

{new Date(user.createdAt).toLocaleDateString("fr-FR")}

</td>


<td className="px-6 py-3 flex gap-2">

{editingUser === user._id ? (

<>

<button
onClick={() => handleSaveEdit(user._id)}
className="bg-green-600 text-white px-3 py-1 rounded-lg hover:bg-green-700"
>
Save
</button>

<button
onClick={handleCancelEdit}
className="bg-gray-200 px-3 py-1 rounded-lg"
>
Cancel
</button>

</>

) : (

<>

<button
onClick={() => handleEdit(user)}
className="bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600"
>
Edit
</button>

<button
onClick={() => handleDelete(user._id)}
className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600"
>
Delete
</button>

</>

)}

</td>

</tr>

))}

</tbody>

</table>

</div>

</main>

</div>

);
};

export default AdminDashboard;