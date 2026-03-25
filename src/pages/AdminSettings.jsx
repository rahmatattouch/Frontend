import { useState } from "react";
import { Save, RefreshCw, Bell, Lock, Server, Brain, Mail } from "lucide-react";

const sections = [
  { id: "general", label: "Général", icon: Server },
 
  { id: "notifications", label: "Notifications", icon: Bell },
  { id: "securite", label: "Sécurité", icon: Lock },
  
];

function Toggle({ value, onChange }) {
  return (
    <button
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-colors ${value ? "bg-green-600" : "bg-gray-200"}`}
    >
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

export default function AdminSettings() {
  const [activeSection, setActiveSection] = useState("general");
  const [saved, setSaved] = useState(false);

  const [general, setGeneral] = useState({ platformName: "SecureAudit", maxConcurrent: "5", timeout: "30", maintenanceMode: false });
  const [ia, setIa] = useState({ model: "isolation_forest", sensitivity: "medium", autoRecommend: true, reduceFP: true });
  const [notifs, setNotifs] = useState({ emailCritical: true, emailReport: true, inAppAlert: true, weeklyDigest: false });
  const [security, setSecurity] = useState({ mfa: false, sessionTimeout: "60", rateLimit: "100", ipWhitelist: "" });
  const [smtp, setSmtp] = useState({ host: "smtp.ithouse.tn", port: "587", user: "noreply@ithouse.tn", tls: true });

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2500); };

  const inputCls = "bg-white border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition w-48";

  const renderContent = () => {
    switch (activeSection) {
      case "general":
        return (
          <>
            <Field label="Nom de la plateforme" desc="Affiché dans l'interface et les rapports">
              <input className={inputCls} value={general.platformName} onChange={(e) => setGeneral({ ...general, platformName: e.target.value })} />
            </Field>
            <Field label="Audits simultanés" desc="Nombre maximum d'audits en parallèle">
              <input className={inputCls} type="number" min="1" max="20" value={general.maxConcurrent} onChange={(e) => setGeneral({ ...general, maxConcurrent: e.target.value })} />
            </Field>
            <Field label="Timeout de requête (s)" desc="Délai maximum par requête HTTP">
              <input className={inputCls} type="number" value={general.timeout} onChange={(e) => setGeneral({ ...general, timeout: e.target.value })} />
            </Field>
            <Field label="Mode maintenance" desc="Désactive l'accès public à la plateforme">
              <Toggle value={general.maintenanceMode} onChange={(v) => setGeneral({ ...general, maintenanceMode: v })} />
            </Field>
          </>
        );
      
      case "notifications":
        return (
          <>
            <Field label="Email — Vulnérabilités critiques" desc="Alertes immédiates par email">
              <Toggle value={notifs.emailCritical} onChange={(v) => setNotifs({ ...notifs, emailCritical: v })} />
            </Field>
            <Field label="Email — Rapport d'audit" desc="Envoi du rapport à la fin de chaque audit">
              <Toggle value={notifs.emailReport} onChange={(v) => setNotifs({ ...notifs, emailReport: v })} />
            </Field>
            <Field label="Alertes in-app" desc="Notifications dans le tableau de bord">
              <Toggle value={notifs.inAppAlert} onChange={(v) => setNotifs({ ...notifs, inAppAlert: v })} />
            </Field>
            <Field label="Résumé hebdomadaire" desc="Récapitulatif envoyé chaque lundi">
              <Toggle value={notifs.weeklyDigest} onChange={(v) => setNotifs({ ...notifs, weeklyDigest: v })} />
            </Field>
          </>
        );
      case "securite":
        return (
          <>
            <Field label="Authentification double facteur" desc="MFA obligatoire pour les admins">
              <Toggle value={security.mfa} onChange={(v) => setSecurity({ ...security, mfa: v })} />
            </Field>
            <Field label="Expiration de session (min)" desc="Durée avant déconnexion automatique">
              <input className={inputCls} type="number" value={security.sessionTimeout} onChange={(e) => setSecurity({ ...security, sessionTimeout: e.target.value })} />
            </Field>
            <Field label="Limite de requêtes / heure" desc="Rate limiting par utilisateur">
              <input className={inputCls} type="number" value={security.rateLimit} onChange={(e) => setSecurity({ ...security, rateLimit: e.target.value })} />
            </Field>
            <Field label="Whitelist IP" desc="Laisser vide pour accès universel">
              <input className={inputCls} placeholder="192.168.1.0/24" value={security.ipWhitelist} onChange={(e) => setSecurity({ ...security, ipWhitelist: e.target.value })} />
            </Field>
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
          <p className="text-sm text-gray-500 mt-0.5">Configuration de la plateforme SecureAudit</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-700 border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 transition bg-white">
            <RefreshCw size={13} />
            Réinitialiser
          </button>
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
      </div>

      <div className="flex gap-6">
        <div className="w-52 shrink-0 space-y-1">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveSection(id)}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm text-left transition ${
                activeSection === id
                  ? "bg-green-50 text-green-700 border border-green-200 font-medium"
                  : "text-gray-500 hover:text-gray-800 hover:bg-gray-50"
              }`}
            >
              <Icon size={15} className="shrink-0" />
              {label}
            </button>
          ))}
        </div>

        <div className="flex-1 bg-white border border-gray-200 rounded-xl px-6 shadow-sm">
          <div className="divide-y divide-gray-100">{renderContent()}</div>
        </div>
      </div>
    </div>
  );
}