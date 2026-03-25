import { useState, useRef } from "react";
import { User, Bell, Lock, Palette, Save, Eye, EyeOff, Camera } from "lucide-react";

const sections = [
  { id: "profile", label: "Profil", icon: User },
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "securite", label: "Sécurité", icon: Lock },
 
];

function Toggle({ value, onChange }) {
  return (
    <button onClick={() => onChange(!value)} className={`relative w-10 h-5 rounded-full transition-colors ${value ? "bg-green-600" : "bg-gray-200"}`}>
      <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${value ? "translate-x-5" : ""}`} />
    </button>
  );
}

function Field({ label, desc, children }) {
  return (
    <div className="flex items-start justify-between gap-4 py-4 border-b border-gray-100">
      <div className="flex-1">
        <p className="text-sm text-gray-900">{label}</p>
        {desc && <p className="text-xs text-gray-400 mt-0.5">{desc}</p>}
      </div>
      <div className="shrink-0">{children}</div>
    </div>
  );
}

const inputCls = "bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition w-56";

export default function Settings() {
  const [active, setActive] = useState("profile");
  const [saved, setSaved] = useState(false);
  const [showPwd, setShowPwd] = useState(false);
  const [showNewPwd, setShowNewPwd] = useState(false);

  const [profile, setProfile] = useState({
    firstName: "Sonia",
    lastName: "Ben Ali",
    email: "sonia@corp.fr",
    company: "Corp Industries",
    phone: "+216 55 123 456",
    bio: "",
  });

  const [notifs, setNotifs] = useState({
    emailScanComplete: true,
    emailCritical: true,
    emailWeekly: false,
    inAppAlerts: true,
    inAppScanDone: true,
  });

  const [security, setSecurity] = useState({
    currentPwd: "",
    newPwd: "",
    mfa: false,
    sessionAlert: true,
  });

  const [prefs, setPrefs] = useState({
    defaultScanMode: "standard",
    autoDownloadReport: false,
    language: "fr",
    dateFormat: "DD/MM/YYYY",
  });

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const renderContent = () => {
    switch (active) {
      case "profile":
        return (
          <>
            {/* Avatar */}
            <div className="flex items-center gap-4 py-5 border-b border-gray-100">
              <div className="relative">
                <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center text-xl font-semibold text-green-700">
                  SB
                </div>
                <button className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-600 flex items-center justify-center border-2 border-white hover:bg-green-700 transition">
                  <Camera size={11} className="text-white" />
                </button>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Photo de profil</p>
                <p className="text-xs text-gray-400 mt-0.5">JPG ou PNG, max 2MB</p>
              </div>
            </div>

            <Field label="Prénom" desc="">
              <input className={inputCls} value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
            </Field>
            <Field label="Nom" desc="">
              <input className={inputCls} value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
            </Field>
            <Field label="Adresse email" desc="Utilisée pour les notifications et la connexion">
              <input className={inputCls} type="email" value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
            </Field>
            <Field label="Entreprise" desc="">
              <input className={inputCls} value={profile.company} onChange={(e) => setProfile({ ...profile, company: e.target.value })} />
            </Field>
            <Field label="Téléphone" desc="">
              <input className={inputCls} value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} />
            </Field>
            <div className="py-4">
              <label className="text-sm text-gray-900 block mb-1.5">Biographie</label>
              <textarea
                rows={3}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="Décrivez votre rôle..."
                className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition resize-none"
              />
            </div>
          </>
        );

      case "notifications":
        return (
          <>
            <div className="py-3 border-b border-gray-100 mb-1">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Par email</p>
            </div>
            <Field label="Scan terminé" desc="Recevoir un email à la fin de chaque analyse">
              <Toggle value={notifs.emailScanComplete} onChange={(v) => setNotifs({ ...notifs, emailScanComplete: v })} />
            </Field>
            <Field label="Vulnérabilité critique détectée" desc="Alerte immédiate par email">
              <Toggle value={notifs.emailCritical} onChange={(v) => setNotifs({ ...notifs, emailCritical: v })} />
            </Field>
            <Field label="Récapitulatif hebdomadaire" desc="Résumé de votre activité chaque lundi">
              <Toggle value={notifs.emailWeekly} onChange={(v) => setNotifs({ ...notifs, emailWeekly: v })} />
            </Field>
            <div className="py-3 border-b border-gray-100 mb-1 mt-2">
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Dans l'application</p>
            </div>
            <Field label="Alertes de sécurité" desc="Notifications dans la barre latérale">
              <Toggle value={notifs.inAppAlerts} onChange={(v) => setNotifs({ ...notifs, inAppAlerts: v })} />
            </Field>
            <Field label="Fin d'analyse" desc="Notification quand un scan est terminé">
              <Toggle value={notifs.inAppScanDone} onChange={(v) => setNotifs({ ...notifs, inAppScanDone: v })} />
            </Field>
          </>
        );

      case "securite":
        return (
          <>
            <div className="py-4 border-b border-gray-100 space-y-3">
              <p className="text-sm text-gray-900 font-medium">Changer le mot de passe</p>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Mot de passe actuel</label>
                <div className="relative">
                  <input
                    type={showPwd ? "text" : "password"}
                    value={security.currentPwd}
                    onChange={(e) => setSecurity({ ...security, currentPwd: e.target.value })}
                    placeholder="••••••••"
                    className={`${inputCls} pr-9`}
                  />
                  <button onClick={() => setShowPwd(!showPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-400 mb-1.5 block">Nouveau mot de passe</label>
                <div className="relative">
                  <input
                    type={showNewPwd ? "text" : "password"}
                    value={security.newPwd}
                    onChange={(e) => setSecurity({ ...security, newPwd: e.target.value })}
                    placeholder="••••••••"
                    className={`${inputCls} pr-9`}
                  />
                  <button onClick={() => setShowNewPwd(!showNewPwd)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                    {showNewPwd ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
                {security.newPwd.length > 0 && (
                  <div className="flex gap-1 mt-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`h-1 flex-1 rounded-full ${
                        security.newPwd.length >= i * 3 ? (security.newPwd.length >= 10 ? "bg-green-500" : "bg-yellow-400") : "bg-gray-200"
                      }`} />
                    ))}
                  </div>
                )}
              </div>
            </div>
            
          </>
        );

     

      default: return null;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold text-gray-900">Paramètres</h1>
          <p className="text-sm text-gray-500 mt-0.5">Gérez votre compte et vos préférences</p>
        </div>
        <button
          onClick={handleSave}
          className={`flex items-center gap-1.5 text-xs px-4 py-2 rounded-lg font-medium transition ${
            saved ? "bg-green-50 text-green-700 border border-green-200" : "bg-green-600 hover:bg-green-700 text-white shadow-sm"
          }`}
        >
          <Save size={13} />
          {saved ? "Enregistré ✓" : "Enregistrer"}
        </button>
      </div>

      <div className="flex gap-6">
        {/* Sidebar nav */}
        <div className="w-48 shrink-0 space-y-1">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition ${
                active === id
                  ? "bg-green-50 text-green-700 border border-green-200 font-medium"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <Icon size={15} className="shrink-0" />
              {label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 bg-white border border-gray-200 rounded-xl px-6 shadow-sm">
          <div className="divide-y divide-gray-100">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}