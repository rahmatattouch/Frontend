import React, { useMemo, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "",
    email: "",
    mdp: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({
    nom: "",
    prenom: "",
    email: "",
    mdp: "",
    confirmPassword: "",
    global: "",
  });

  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { register } = useAuth();

  const emailRegex = useMemo(() => /^\S+@\S+\.\S+$/, []);

  // ✅ Conditions mot de passe
  const hasLower = (s) => /[a-z]/.test(s);
  const hasUpper = (s) => /[A-Z]/.test(s);
  const hasNumber = (s) => /\d/.test(s);
  const minLen = (s) => (s || "").length >= 8;

  const setField = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "", global: "" }));
  };

  const validateAll = () => {
    const next = {
      nom: "",
      prenom: "",
      email: "",
      mdp: "",
      confirmPassword: "",
      global: "",
    };

    const nom = formData.nom.trim();
    const prenom = formData.prenom.trim();
    const email = formData.email.trim();
    const mdp = formData.mdp;
    const confirm = formData.confirmPassword;

    if (!nom) next.nom = "Nom requis.";
    else if (nom.length < 2) next.nom = "Nom invalide (min 2 caractères).";

    if (!prenom) next.prenom = "Prénom requis.";
    else if (prenom.length < 2) next.prenom = "Prénom invalide (min 2 caractères).";

    if (!email) next.email = "Email requis.";
    else if (!emailRegex.test(email)) next.email = "Email invalide (ex: nom@domaine.com).";

    // ✅ Mot de passe: 8 chars + minuscule + majuscule + nombre
    if (!mdp) {
      next.mdp = "Mot de passe requis.";
    } else if (!minLen(mdp)) {
      next.mdp = "Mot de passe invalide (min 8 caractères).";
    } else if (!hasLower(mdp)) {
      next.mdp = "Mot de passe invalide (ajoute au moins 1 minuscule).";
    } else if (!hasUpper(mdp)) {
      next.mdp = "Mot de passe invalide (ajoute au moins 1 majuscule).";
    } else if (!hasNumber(mdp)) {
      next.mdp = "Mot de passe invalide (ajoute au moins 1 chiffre).";
    }

    if (!confirm) next.confirmPassword = "Confirmation requise.";
    else if (mdp !== confirm) next.confirmPassword = "Les mots de passe ne correspondent pas.";

    const hasErrors = Object.entries(next).some(([k, v]) => k !== "global" && Boolean(v));
    return { nextErrors: next, hasErrors };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { nextErrors, hasErrors } = validateAll();
    if (hasErrors) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    setErrors((prev) => ({ ...prev, global: "" }));

    try {
      const fd = new FormData();
      fd.append("nom", formData.nom.trim());
      fd.append("prenom", formData.prenom.trim());
      fd.append("email", formData.email.trim());
      fd.append("mdp", formData.mdp);

      await register(fd);
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err);
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Inscription impossible. Vérifiez vos informations et réessayez.";
      setErrors((prev) => ({ ...prev, global: msg }));
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full px-5 py-3 border rounded focus:outline-none focus:ring-2 focus:ring-[#10b981] focus:border-[#10b981]";
  const inputErr = "border-red-300 focus:ring-red-500/20 focus:border-red-400";
  const helpErr = "mt-1 text-[12px] text-red-600";

  // ✅ Petit affichage des règles en live (optionnel mais utile)
  const pwdChecks = useMemo(() => {
    const p = formData.mdp || "";
    return {
      minLen: minLen(p),
      lower: hasLower(p),
      upper: hasUpper(p),
      number: hasNumber(p),
    };
  }, [formData.mdp]);

  const Rule = ({ ok, children }) => (
    <li className={`text-[11px] ${ok ? "text-green-700" : "text-gray-500"}`}>
      {ok ? "✓" : "•"} {children}
    </li>
  );

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

          {errors.global && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded mb-4">
              {errors.global}
            </div>
          )}

          <form noValidate onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <input
                  type="text"
                  name="nom"
                  placeholder="Nom"
                  value={formData.nom}
                  onChange={(e) => setField("nom", e.target.value)}
                  className={`${inputBase} ${errors.nom ? inputErr : "border-gray-300"}`}
                />
                {errors.nom && <p className={helpErr}>{errors.nom}</p>}
              </div>

              <div>
                <input
                  type="text"
                  name="prenom"
                  placeholder="Prénom"
                  value={formData.prenom}
                  onChange={(e) => setField("prenom", e.target.value)}
                  className={`${inputBase} ${errors.prenom ? inputErr : "border-gray-300"}`}
                />
                {errors.prenom && <p className={helpErr}>{errors.prenom}</p>}
              </div>
            </div>

            <div>
              <input
                type="text"
                name="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setField("email", e.target.value)}
                className={`${inputBase} ${errors.email ? inputErr : "border-gray-300"}`}
              />
              {errors.email && <p className={helpErr}>{errors.email}</p>}
            </div>

            <div>
              <input
                type="password"
                name="mdp"
                placeholder="Mot de passe"
                value={formData.mdp}
                onChange={(e) => setField("mdp", e.target.value)}
                className={`${inputBase} ${errors.mdp ? inputErr : "border-gray-300"}`}
              />
              {errors.mdp && <p className={helpErr}>{errors.mdp}</p>}

              {/* ✅ règles affichées sous le champ */}
              <ul className="mt-2 space-y-1">
                <Rule ok={pwdChecks.minLen}>Au moins 8 caractères</Rule>
                <Rule ok={pwdChecks.lower}>Au moins 1 minuscule (a-z)</Rule>
                <Rule ok={pwdChecks.upper}>Au moins 1 majuscule (A-Z)</Rule>
                <Rule ok={pwdChecks.number}>Au moins 1 chiffre (0-9)</Rule>
              </ul>
            </div>

            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirmer le mot de passe"
                value={formData.confirmPassword}
                onChange={(e) => setField("confirmPassword", e.target.value)}
                className={`${inputBase} ${errors.confirmPassword ? inputErr : "border-gray-300"}`}
              />
              {errors.confirmPassword && <p className={helpErr}>{errors.confirmPassword}</p>}
            </div>

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