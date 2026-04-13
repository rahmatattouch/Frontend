import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    mdp: "",
    confirmPassword: "",
    // si tu veux ajouter upload image plus tard:
    // image: null,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    // si tu ajoutes un input type="file" name="image"
    if (name === "image") {
      setFormData((prev) => ({ ...prev, image: files?.[0] || null }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const nom = formData.nom.trim();
    const prenom = formData.prenom.trim();
    const email = formData.email.trim();
    const mdp = formData.mdp;
    const confirm = formData.confirmPassword;

    if (!nom) return "Veuillez saisir votre nom.";
    if (!prenom) return "Veuillez saisir votre prénom.";
    if (!email) return "Veuillez saisir votre adresse e-mail.";
    if (!/^\S+@\S+\.\S+$/.test(email)) return "Veuillez saisir une adresse e-mail valide.";
    if (!mdp) return "Veuillez choisir un mot de passe.";
    if (mdp.length < 6) return "Le mot de passe doit contenir au moins 6 caractères.";
    if (!confirm) return "Veuillez confirmer votre mot de passe.";
    if (mdp !== confirm) return "Les mots de passe ne correspondent pas.";
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const v = validate();
    if (v) {
      setError(v);
      return;
    }

    setLoading(true);

    try {
      // ✅ IMPORTANT: envoyer FormData (si backend utilise upload.single("image"))
      const fd = new FormData();
      fd.append("nom", formData.nom.trim());
      fd.append("prenom", formData.prenom.trim());
      fd.append("email", formData.email.trim());
      fd.append("mdp", formData.mdp);

      // si tu actives l'upload image:
      // if (formData.image) fd.append("image", formData.image);

      await register(fd);
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err);
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Inscription impossible. Vérifiez vos informations et réessayez."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="flex flex-col md:flex-row w-full max-w-6xl shadow-xl rounded-lg overflow-hidden">
        {/* Welcome Section */}
        <div
          className="hidden md:flex md:w-3/5 flex-col justify-center items-center p-12"
          style={{ backgroundColor: "#10b981", color: "white" }}
        >
          <h1 className="text-4xl font-bold mb-6">Joindre notre plateforme</h1>
          <p className="mb-8 text-center text-lg">
            Créez un compte et commencez à explorer notre plateforme
          </p>
          <Link
            to="/login"
            className="bg-white text-[#10b981] font-semibold px-8 py-3 rounded hover:bg-gray-100 transition"
          >
            SE CONNECTER
          </Link>
        </div>

        {/* Register Section */}
        <div className="w-full md:w-2/5 bg-white p-10 md:p-16 flex flex-col justify-center">
          <h2 className="text-3xl font-bold mb-6 text-gray-800">Créer un compte</h2>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
              {error}
            </div>
          )}

          <form noValidate onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <input
                type="text"
                name="nom"
                placeholder="Nom"
                value={formData.nom}
                onChange={handleChange}
                className="w-full min-w-0 px-5 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981]"
              />
              <input
                type="text"
                name="prenom"
                placeholder="Prénom"
                value={formData.prenom}
                onChange={handleChange}
                className="w-full min-w-0 px-5 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981]"
              />
            </div>

            <input
              type="text"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-5 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981]"
            />

            <input
              type="password"
              name="mdp"
              placeholder="Mot de passe"
              value={formData.mdp}
              onChange={handleChange}
              className="w-full px-5 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981]"
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirmer le mot de passe"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-5 py-3 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981]"
            />

            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-3 rounded hover:opacity-90 transition disabled:opacity-50"
              style={{ backgroundColor: "#10b981" }}
            >
              {loading ? "CRÉATION..." : "CRÉER UN COMPTE"}
            </button>
          </form>

          <p className="mt-6 text-center text-gray-600">
            Vous avez déjà un compte ?{" "}
            <Link to="/login" className="text-[#10b981] font-semibold hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}