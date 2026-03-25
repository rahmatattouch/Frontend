import { useState } from "react";
import {
  ScanSearch, ShieldCheck, ShieldAlert, ShieldX, ChevronDown,
  ChevronUp, CheckCircle2, XCircle, AlertTriangle, Loader2, Globe
} from "lucide-react";

const STEPS = ["Résolution DNS", "Handshake TLS", "Analyse HTTP", "Détection vulnérabilités", "Rapport IA"];

const mockResults = {
  score: 62,
  risk: "Moyen",
  ssl: true,
  sslExpiry: "12/09/2026",
  redirect: true,
  server: "nginx/1.24.0",
  headers: [
    { name: "Content-Security-Policy", present: false, critical: true },
    { name: "Strict-Transport-Security", present: true, critical: true },
    { name: "X-Frame-Options", present: true, critical: false },
    { name: "X-Content-Type-Options", present: true, critical: false },
    { name: "Referrer-Policy", present: false, critical: false },
    { name: "Permissions-Policy", present: false, critical: false },
  ],
  vulns: [
    { id: "V-001", severity: "Élevé", title: "CSP absente", description: "Aucune politique de sécurité du contenu configurée. Risque XSS élevé.", fix: "Ajouter l'en-tête Content-Security-Policy avec une politique restrictive." },
    { id: "V-002", severity: "Moyen", title: "Referrer-Policy manquante", description: "Les informations de référence sont exposées aux sites tiers.", fix: "Définir Referrer-Policy: strict-origin-when-cross-origin." },
    { id: "V-003", severity: "Faible", title: "Permissions-Policy absente", description: "Les permissions du navigateur ne sont pas restreintes.", fix: "Ajouter Permissions-Policy pour limiter l'accès aux API sensibles." },
  ],
  recommendations: [
    "Mettre en place une politique CSP stricte pour prévenir les attaques XSS",
    "Configurer Referrer-Policy pour protéger la confidentialité des utilisateurs",
    "Envisager l'ajout d'un WAF (Web Application Firewall)",
  ],
};

const severityColor = {
  Critique: "bg-red-100 text-red-700 border-red-200",
  Élevé: "bg-orange-100 text-orange-700 border-orange-200",
  Moyen: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Faible: "bg-green-100 text-green-700 border-green-200",
};

const scoreColor = (s) => s >= 75 ? "#16a34a" : s >= 50 ? "#eab308" : "#ef4444";

export default function Labs() {
  const [url, setUrl] = useState("");
  const [scanMode, setScanMode] = useState("standard");
  const [status, setStatus] = useState("idle"); // idle | scanning | done
  const [currentStep, setCurrentStep] = useState(0);
  const [openVuln, setOpenVuln] = useState(null);
  const [results, setResults] = useState(null);

  const startScan = () => {
    if (!url.trim()) return;
    setStatus("scanning");
    setCurrentStep(0);
    setResults(null);

    const advance = (step) => {
      setTimeout(() => {
        setCurrentStep(step);
        if (step < STEPS.length - 1) advance(step + 1);
        else {
          setTimeout(() => {
            setStatus("done");
            setResults(mockResults);
          }, 800);
        }
      }, 700 + step * 200);
    };
    advance(1);
  };

  const reset = () => { setStatus("idle"); setUrl(""); setCurrentStep(0); setResults(null); };

  return (
    <div className="p-6 space-y-6 max-w-3xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Nouveau scan</h1>
        <p className="text-sm text-gray-500 mt-0.5">Analysez la sécurité HTTP/HTTPS d'un site web</p>
      </div>

      {/* Scan form */}
      {status === "idle" && (
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm space-y-5">
          <div>
            <label className="text-xs font-medium text-gray-700 mb-2 block">URL cible</label>
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Globe size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && startScan()}
                  placeholder="https://example.com"
                  className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition"
                />
              </div>
              <button
                onClick={startScan}
                disabled={!url.trim()}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition shadow-sm"
              >
                <ScanSearch size={15} />
                Scanner
              </button>
            </div>
          </div>

          {/* Scan mode */}
          <div>
            <label className="text-xs font-medium text-gray-700 mb-2 block">Mode d'analyse</label>
            <div className="grid grid-cols-3 gap-3">
              {[
                { id: "rapide", label: "Rapide", desc: "En-têtes & SSL seulement", time: "~10s" },
                { id: "standard", label: "Standard", desc: "Analyse complète HTTP/HTTPS", time: "~30s" },
                { id: "approfondi", label: "Approfondi", desc: "IA + détection avancée", time: "~2min" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setScanMode(m.id)}
                  className={`text-left p-3 rounded-lg border text-xs transition ${
                    scanMode === m.id
                      ? "bg-green-50 border-green-300 text-green-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <p className="font-medium mb-0.5">{m.label}</p>
                  <p className="text-gray-400 text-[11px]">{m.desc}</p>
                  <p className={`mt-1 text-[11px] font-medium ${scanMode === m.id ? "text-green-600" : "text-gray-400"}`}>{m.time}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-3">
            {[
              "Vérifier le certificat SSL",
              "Analyser les en-têtes HTTP",
              "Détecter les redirections",
              "Rapport de recommandations IA",
            ].map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
                <input type="checkbox" defaultChecked className="accent-green-600 w-3.5 h-3.5" />
                {opt}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* Scanning progress */}
      {status === "scanning" && (
        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-3">
              <Loader2 size={24} className="text-green-600 animate-spin" />
            </div>
            <p className="text-sm font-medium text-gray-900">Analyse en cours...</p>
            <p className="text-xs text-gray-400 mt-1 font-mono">{url}</p>
          </div>

          <div className="space-y-3 max-w-sm mx-auto">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  i < currentStep ? "bg-green-600" :
                  i === currentStep ? "bg-green-100 border-2 border-green-600" :
                  "bg-gray-100"
                }`}>
                  {i < currentStep ? (
                    <CheckCircle2 size={14} className="text-white" />
                  ) : i === currentStep ? (
                    <Loader2 size={11} className="text-green-600 animate-spin" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-gray-300" />
                  )}
                </div>
                <span className={`text-sm transition ${
                  i < currentStep ? "text-green-600" :
                  i === currentStep ? "text-gray-900 font-medium" :
                  "text-gray-400"
                }`}>{step}</span>
              </div>
            ))}
          </div>

          <div className="mt-6 bg-gray-100 rounded-full h-1.5 overflow-hidden">
            <div
              className="bg-green-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${(currentStep / STEPS.length) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Results */}
      {status === "done" && results && (
        <div className="space-y-4">
          {/* Score header */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <div className="flex items-center gap-5">
              <svg width="90" height="90" viewBox="0 0 90 90" className="shrink-0">
                <circle cx="45" cy="45" r="38" fill="none" stroke="#e5e7eb" strokeWidth="7" />
                <circle cx="45" cy="45" r="38" fill="none" stroke={scoreColor(results.score)} strokeWidth="7"
                  strokeDasharray={`${(results.score / 100) * 239} 239`} strokeLinecap="round" transform="rotate(-90 45 45)" />
                <text x="45" y="42" textAnchor="middle" fontSize="22" fill={scoreColor(results.score)} fontWeight="700">{results.score}</text>
                <text x="45" y="57" textAnchor="middle" fontSize="11" fill="#9ca3af">/100</text>
              </svg>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-lg font-semibold text-gray-900 font-mono">{url}</p>
                  <span className={`text-xs px-2 py-0.5 rounded-md border ${severityColor[results.risk]}`}>{results.risk}</span>
                </div>
                <p className="text-sm text-gray-500 mb-3">Analyse terminée — {results.vulns.length} vulnérabilité(s) détectée(s)</p>
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-[11px] text-gray-400">SSL</p>
                    <p className={`text-sm font-medium ${results.ssl ? "text-green-600" : "text-red-500"}`}>{results.ssl ? "✓ Valide" : "✗ Absent"}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-[11px] text-gray-400">Expiration</p>
                    <p className="text-sm font-medium text-gray-700">{results.sslExpiry}</p>
                  </div>
                  <div className="bg-gray-50 rounded-lg px-3 py-2">
                    <p className="text-[11px] text-gray-400">Serveur</p>
                    <p className="text-sm font-medium text-gray-700 truncate">{results.server}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Headers */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-900 mb-3">En-têtes de sécurité HTTP</p>
            <div className="grid grid-cols-2 gap-2">
              {results.headers.map((h) => (
                <div key={h.name} className={`flex items-center gap-2.5 px-3 py-2 rounded-lg border text-xs ${
                  h.present ? "bg-green-50 border-green-200" : h.critical ? "bg-red-50 border-red-200" : "bg-yellow-50 border-yellow-200"
                }`}>
                  {h.present ? (
                    <CheckCircle2 size={13} className="text-green-600 shrink-0" />
                  ) : h.critical ? (
                    <XCircle size={13} className="text-red-500 shrink-0" />
                  ) : (
                    <AlertTriangle size={13} className="text-yellow-600 shrink-0" />
                  )}
                  <span className={`font-mono text-[11px] ${h.present ? "text-green-700" : h.critical ? "text-red-700" : "text-yellow-700"}`}>
                    {h.name}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Vulnerabilities */}
          <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-900 mb-3">Vulnérabilités détectées</p>
            <div className="space-y-2">
              {results.vulns.map((v) => (
                <div key={v.id} className="border border-gray-100 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setOpenVuln(openVuln === v.id ? null : v.id)}
                    className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition text-left"
                  >
                    <span className={`text-[11px] px-2 py-0.5 rounded border shrink-0 ${severityColor[v.severity]}`}>{v.severity}</span>
                    <span className="text-sm text-gray-900 flex-1 font-medium">{v.title}</span>
                    <span className="text-xs text-gray-400 font-mono">{v.id}</span>
                    {openVuln === v.id ? <ChevronUp size={14} className="text-gray-400" /> : <ChevronDown size={14} className="text-gray-400" />}
                  </button>
                  {openVuln === v.id && (
                    <div className="px-4 pb-4 border-t border-gray-100 pt-3 space-y-2">
                      <p className="text-xs text-gray-600">{v.description}</p>
                      <div className="bg-green-50 border border-green-200 rounded-lg px-3 py-2">
                        <p className="text-[11px] text-green-600 font-medium mb-0.5">Recommandation IA</p>
                        <p className="text-xs text-green-700">{v.fix}</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-green-50 border border-green-200 rounded-xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <ShieldCheck size={16} className="text-green-600" />
              <p className="text-sm font-medium text-green-800">Recommandations IA</p>
            </div>
            <ul className="space-y-2">
              {results.recommendations.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-xs text-green-700">
                  <span className="w-4 h-4 rounded-full bg-green-200 text-green-700 font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">{i + 1}</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button onClick={reset} className="flex-1 border border-gray-200 text-gray-600 text-sm py-2.5 rounded-lg hover:bg-gray-50 transition bg-white">
              Nouveau scan
            </button>
            <button className="flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2.5 rounded-lg transition shadow-sm">
              Télécharger le rapport PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}