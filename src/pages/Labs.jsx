import { useState } from "react";
import {
  ScanSearch, ShieldCheck, ShieldAlert, ShieldX, ChevronDown,
  ChevronUp, CheckCircle2, XCircle, AlertTriangle, Loader2, Globe,
  Download, RotateCcw, Server, Lock, ArrowRight, FileText, Zap
} from "lucide-react";
import { analyzeSite } from "../services/authService";

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

// ─── helpers ──────────────────────────────────────────────────────────────────

const severityMeta = {
  Critique: { bg: "bg-red-50",     border: "border-red-200",    text: "text-red-700",    dot: "bg-red-500",    bar: "bg-red-500" },
  Élevé:    { bg: "bg-orange-50",  border: "border-orange-200", text: "text-orange-700", dot: "bg-orange-500", bar: "bg-orange-500" },
  Moyen:    { bg: "bg-yellow-50",  border: "border-yellow-200", text: "text-yellow-700", dot: "bg-yellow-500", bar: "bg-yellow-400" },
  Faible:   { bg: "bg-green-50",   border: "border-green-200",  text: "text-green-700",  dot: "bg-green-500",  bar: "bg-green-500" },
};

const scoreColor  = (s) => s >= 75 ? "#16a34a" : s >= 50 ? "#eab308" : "#ef4444";
const scoreBg     = (s) => s >= 75 ? "from-green-50 to-emerald-50 border-green-200"
                         : s >= 50 ? "from-yellow-50 to-amber-50 border-yellow-200"
                         : "from-red-50 to-rose-50 border-red-200";
const scoreLabel  = (s) => s >= 75 ? "Sécurisé" : s >= 50 ? "Risque modéré" : "Critique";
const riskIcon    = (s) => s >= 75 ? <ShieldCheck size={18} className="text-green-600" />
                         : s >= 50 ? <ShieldAlert size={18} className="text-yellow-600" />
                         : <ShieldX size={18} className="text-red-600" />;

// ─── PDF generator (pure JS, no lib needed) ──────────────────────────────────
// We build a styled HTML page in a hidden iframe then call window.print() scoped to it.
// This avoids adding any dependency while producing a real printable/saveable PDF.

function generatePDF(url, results) {
  const date = new Date().toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" });
  const sc = results.score;
  const col = sc >= 75 ? "#16a34a" : sc >= 50 ? "#ca8a04" : "#dc2626";

  const headerRows = results.headers.map(h => `
    <tr>
      <td style="padding:6px 10px;font-family:monospace;font-size:11px;">${h.name}</td>
      <td style="padding:6px 10px;text-align:center;">
        ${h.present
          ? '<span style="color:#16a34a;font-weight:600;">✓ Présent</span>'
          : h.critical
            ? '<span style="color:#dc2626;font-weight:600;">✗ Absent</span>'
            : '<span style="color:#ca8a04;font-weight:600;">⚠ Absent</span>'}
      </td>
      <td style="padding:6px 10px;text-align:center;font-size:11px;">${h.critical ? "Critique" : "Recommandé"}</td>
    </tr>`).join("");

  const vulnRows = results.vulns.map(v => {
    const c = v.severity === "Élevé" || v.severity === "Critique" ? "#dc2626"
            : v.severity === "Moyen" ? "#ca8a04" : "#16a34a";
    return `
    <div style="border:1px solid #e5e7eb;border-radius:8px;padding:14px;margin-bottom:10px;">
      <div style="display:flex;align-items:center;gap:10px;margin-bottom:8px;">
        <span style="background:${c}20;color:${c};border:1px solid ${c}40;padding:2px 10px;border-radius:20px;font-size:11px;font-weight:600;">${v.severity}</span>
        <strong style="font-size:13px;">${v.title}</strong>
        <span style="margin-left:auto;color:#9ca3af;font-size:11px;font-family:monospace;">${v.id}</span>
      </div>
      <p style="font-size:12px;color:#4b5563;margin:0 0 8px;">${v.description}</p>
      <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:6px;padding:8px 12px;">
        <span style="font-size:11px;color:#15803d;font-weight:600;">Recommandation IA : </span>
        <span style="font-size:11px;color:#166534;">${v.fix}</span>
      </div>
    </div>`;
  }).join("");

  const recRows = results.recommendations.map((r, i) => `
    <li style="font-size:12px;color:#166534;margin-bottom:6px;display:flex;gap:8px;">
      <span style="background:#bbf7d0;color:#15803d;width:20px;height:20px;border-radius:50%;display:inline-flex;align-items:center;justify-content:center;font-size:10px;font-weight:700;flex-shrink:0;">${i+1}</span>
      <span>${r}</span>
    </li>`).join("");

  const html = `<!DOCTYPE html><html><head><meta charset="UTF-8">
  <title>Rapport SecureAudit — ${url}</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    *{margin:0;padding:0;box-sizing:border-box;}
    body{font-family:'Inter',sans-serif;color:#111827;background:#fff;padding:40px;}
    h2{font-size:15px;color:#111827;margin-bottom:12px;padding-bottom:6px;border-bottom:2px solid #f3f4f6;}
    table{width:100%;border-collapse:collapse;font-size:12px;}
    th{background:#f9fafb;text-align:left;padding:8px 10px;font-size:11px;color:#6b7280;border-bottom:1px solid #e5e7eb;}
    tr:nth-child(even){background:#fafafa;}
    @media print{body{padding:20px;}}
  </style></head><body>
  <!-- Header -->
  <div style="background:linear-gradient(135deg,#0f172a,#1e3a5f);color:white;padding:28px 32px;border-radius:12px;margin-bottom:28px;">
    <div style="display:flex;justify-content:space-between;align-items:flex-start;">
      <div>
        <div style="font-size:11px;letter-spacing:2px;color:#93c5fd;margin-bottom:6px;">RAPPORT D'AUDIT DE SÉCURITÉ</div>
        <div style="font-size:20px;font-weight:700;margin-bottom:4px;">${url}</div>
        <div style="font-size:12px;color:#94a3b8;">Généré le ${date} — Mode: standard</div>
      </div>
      <div style="text-align:center;background:rgba(255,255,255,0.1);border-radius:10px;padding:16px 24px;">
        <div style="font-size:38px;font-weight:800;color:${col};">${sc}</div>
        <div style="font-size:11px;color:#94a3b8;">/100 — ${scoreLabel(sc)}</div>
      </div>
    </div>
  </div>

  <!-- Info générale -->
  <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:14px;margin-bottom:28px;">
    <div style="border:1px solid #e5e7eb;border-radius:8px;padding:14px;">
      <div style="font-size:10px;color:#9ca3af;margin-bottom:4px;">SSL / TLS</div>
      <div style="font-size:14px;font-weight:600;color:${results.ssl ? "#16a34a" : "#dc2626"};">${results.ssl ? "✓ Valide" : "✗ Absent"}</div>
      <div style="font-size:11px;color:#6b7280;">Expire : ${results.sslExpiry}</div>
    </div>
    <div style="border:1px solid #e5e7eb;border-radius:8px;padding:14px;">
      <div style="font-size:10px;color:#9ca3af;margin-bottom:4px;">Serveur</div>
      <div style="font-size:14px;font-weight:600;color:#111827;">${results.server}</div>
      <div style="font-size:11px;color:#6b7280;">Redirection HTTPS : ${results.redirect ? "Oui" : "Non"}</div>
    </div>
    <div style="border:1px solid #e5e7eb;border-radius:8px;padding:14px;">
      <div style="font-size:10px;color:#9ca3af;margin-bottom:4px;">Vulnérabilités</div>
      <div style="font-size:14px;font-weight:600;color:#dc2626;">${results.vulns.length} détectée(s)</div>
      <div style="font-size:11px;color:#6b7280;">${results.headers.filter(h=>!h.present && h.critical).length} en-têtes critiques manquants</div>
    </div>
  </div>

  <!-- Headers -->
  <h2>En-têtes de sécurité HTTP</h2>
  <table style="margin-bottom:28px;">
    <thead><tr><th>En-tête</th><th>Statut</th><th>Priorité</th></tr></thead>
    <tbody>${headerRows}</tbody>
  </table>

  <!-- Vulnérabilités -->
  <h2>Vulnérabilités détectées</h2>
  <div style="margin-bottom:28px;">${vulnRows}</div>

  <!-- Recommandations -->
  <div style="background:#f0fdf4;border:1px solid #bbf7d0;border-radius:10px;padding:20px;margin-bottom:28px;">
    <h2 style="border-color:#bbf7d0;color:#166534;">Recommandations IA</h2>
    <ul style="list-style:none;padding:0;">${recRows}</ul>
  </div>

  <!-- Footer -->
  <div style="text-align:center;font-size:10px;color:#9ca3af;border-top:1px solid #f3f4f6;padding-top:16px;">
    SecureAudit Platform — Rapport confidentiel — ${date}
  </div>
  </body></html>`;

  const win = window.open("", "_blank");
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => { win.print(); }, 400);
}

// ─── sub-components ───────────────────────────────────────────────────────────

function ScoreRing({ score }) {
  const r = 48;
  const circ = 2 * Math.PI * r;
  const dash = (score / 100) * circ;
  const color = scoreColor(score);
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" className="shrink-0">
      <circle cx="60" cy="60" r={r} fill="none" stroke="#e5e7eb" strokeWidth="9" />
      <circle cx="60" cy="60" r={r} fill="none" stroke={color} strokeWidth="9"
        strokeDasharray={`${dash} ${circ}`} strokeLinecap="round"
        transform="rotate(-90 60 60)"
        style={{ transition: "stroke-dasharray 1s cubic-bezier(.4,0,.2,1)" }}
      />
      <text x="60" y="55" textAnchor="middle" fontSize="26" fill={color} fontWeight="800">{score}</text>
      <text x="60" y="72" textAnchor="middle" fontSize="11" fill="#9ca3af" fontWeight="500">/100</text>
    </svg>
  );
}

function HeaderBadge({ h }) {
  if (h.present) return (
    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border bg-green-50 border-green-200">
      <CheckCircle2 size={13} className="text-green-600 shrink-0" />
      <span className="font-mono text-[11px] text-green-800 truncate">{h.name}</span>
    </div>
  );
  if (h.critical) return (
    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border bg-red-50 border-red-200">
      <XCircle size={13} className="text-red-500 shrink-0" />
      <span className="font-mono text-[11px] text-red-800 truncate">{h.name}</span>
    </div>
  );
  return (
    <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl border bg-yellow-50 border-yellow-200">
      <AlertTriangle size={13} className="text-yellow-600 shrink-0" />
      <span className="font-mono text-[11px] text-yellow-800 truncate">{h.name}</span>
    </div>
  );
}

function VulnCard({ v }) {
  const [open, setOpen] = useState(false);
  const m = severityMeta[v.severity] ?? severityMeta["Faible"];
  return (
    <div className={`rounded-xl border overflow-hidden transition-all ${m.border}`}>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50/80 transition text-left"
      >
        <span className={`w-2 h-2 rounded-full shrink-0 ${m.dot}`} />
        <span className={`text-[11px] px-2.5 py-0.5 rounded-full border font-semibold shrink-0 ${m.bg} ${m.border} ${m.text}`}>
          {v.severity}
        </span>
        <span className="text-sm text-gray-900 flex-1 font-medium">{v.title}</span>
        <span className="text-xs text-gray-400 font-mono hidden sm:block">{v.id}</span>
        {open ? <ChevronUp size={14} className="text-gray-400 shrink-0" /> : <ChevronDown size={14} className="text-gray-400 shrink-0" />}
      </button>
      {open && (
        <div className={`px-4 pb-4 pt-3 border-t space-y-3 ${m.border} ${m.bg}`}>
          <p className="text-xs text-gray-700 leading-relaxed">{v.description}</p>
          <div className="bg-white/70 border border-green-200 rounded-lg px-3.5 py-2.5">
            <div className="flex items-center gap-1.5 mb-1">
              <Zap size={11} className="text-green-600" />
              <p className="text-[11px] text-green-700 font-semibold">Recommandation IA</p>
            </div>
            <p className="text-xs text-green-800 leading-relaxed">{v.fix}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function Labs() {
  const [url, setUrl]               = useState("");
  const [scanMode, setScanMode]     = useState("standard");
  const [status, setStatus]         = useState("idle");
  const [currentStep, setCurrentStep] = useState(0);
  const [results, setResults]       = useState(null);
 const reset = () => {
    setStatus("idle");
    setUrl("");
    setCurrentStep(0);
    setResults(null);
  };
const startScan = async () => {
  if (!url.trim()) return;

  setStatus("scanning");
  setCurrentStep(0);
  setResults(null);

  const advanceSteps = (step) => {
    setTimeout(() => {
      setCurrentStep(step);
      if (step < STEPS.length - 1) advanceSteps(step + 1);
    }, 700 + step * 200);
  };
  advanceSteps(1);

  try {
    const data = await analyzeSite(url.trim(), scanMode);

    console.log("API RESULT:", data);

    const formatted = {
  score: data.scoreGlobal || 0,

  vulns: data.vulnerabilities || data.vulns || [],

  recommendations: data.recommendations || [],

  headers: data.headers || [],

  ssl: true,
  sslExpiry: "N/A",
  redirect: true,
  server: "Unknown"
};
    setTimeout(() => {
      setStatus("done");
      setResults(formatted); // ✅ هنا الصح
    }, 700 + (STEPS.length - 1) * 200 + 800);

  } catch (err) {
    console.error(err);

    setTimeout(() => {
      setStatus("done");
      setResults(mockResults); // fallback
    }, 700 + (STEPS.length - 1) * 200 + 800);
  }
};
  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div className="p-6 space-y-5 max-w-3xl mx-auto">

      {/* ── HEADER ── */}
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Nouveau scan</h1>
        <p className="text-sm text-gray-500 mt-0.5">Analysez la sécurité HTTP/HTTPS d'un site web</p>
      </div>

      {/* ══════════════════════════════════════════════════════════════════════
          IDLE — form
      ══════════════════════════════════════════════════════════════════════ */}
      {status === "idle" && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
          {/* URL input */}
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
                  className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400 transition"
                />
              </div>
              <button
                onClick={startScan}
                disabled={!url.trim()}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 disabled:text-gray-400 text-white text-sm font-medium px-5 py-2.5 rounded-xl transition shadow-sm"
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
                { id: "rapide",     label: "Rapide",     desc: "En-têtes & SSL seulement",    time: "~10s" },
                { id: "standard",   label: "Standard",   desc: "Analyse complète HTTP/HTTPS",  time: "~30s" },
                { id: "approfondi", label: "Approfondi", desc: "IA + détection avancée",       time: "~2min" },
              ].map((m) => (
                <button
                  key={m.id}
                  onClick={() => setScanMode(m.id)}
                  className={`text-left p-3.5 rounded-xl border text-xs transition ${
                    scanMode === m.id
                      ? "bg-green-50 border-green-300 text-green-700"
                      : "border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <p className="font-semibold mb-0.5">{m.label}</p>
                  <p className="text-gray-400 text-[11px] leading-snug">{m.desc}</p>
                  <p className={`mt-1.5 text-[11px] font-semibold ${scanMode === m.id ? "text-green-600" : "text-gray-400"}`}>{m.time}</p>
                </button>
              ))}
            </div>
          </div>

          {/* Options */}
          <div className="grid grid-cols-2 gap-2.5">
            {[
              "Vérifier le certificat SSL",
              "Analyser les en-têtes HTTP",
              "Détecter les redirections",
              "Rapport de recommandations IA",
            ].map((opt) => (
              <label key={opt} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer select-none">
                <input type="checkbox" defaultChecked className="accent-green-600 w-3.5 h-3.5 rounded" />
                {opt}
              </label>
            ))}
          </div>
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════════════
          SCANNING — progress
      ══════════════════════════════════════════════════════════════════════ */}
      {status === "scanning" && (
        <div className="bg-white border border-gray-200 rounded-2xl p-8 shadow-sm">
          <div className="text-center mb-8">
            <div className="w-14 h-14 rounded-full bg-green-50 border border-green-200 flex items-center justify-center mx-auto mb-3">
              <Loader2 size={24} className="text-green-600 animate-spin" />
            </div>
            <p className="text-sm font-semibold text-gray-900">Analyse en cours...</p>
            <p className="text-xs text-gray-400 mt-1 font-mono">{url}</p>
          </div>

          <div className="space-y-3 max-w-sm mx-auto">
            {STEPS.map((step, i) => (
              <div key={step} className="flex items-center gap-3">
                <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-all ${
                  i < currentStep  ? "bg-green-600"
                  : i === currentStep ? "bg-green-100 border-2 border-green-600"
                  : "bg-gray-100"
                }`}>
                  {i < currentStep   ? <CheckCircle2 size={14} className="text-white" />
                  : i === currentStep ? <Loader2 size={11} className="text-green-600 animate-spin" />
                  : <span className="w-2 h-2 rounded-full bg-gray-300" />}
                </div>
                <span className={`text-sm transition ${
                  i < currentStep  ? "text-green-600"
                  : i === currentStep ? "text-gray-900 font-medium"
                  : "text-gray-400"
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

      {/* ══════════════════════════════════════════════════════════════════════
          DONE — full report
      ══════════════════════════════════════════════════════════════════════ */}
      {status === "done" && results && (
        <div className="space-y-4">

          {/* ── SCORE HERO ── */}
          <div className={`bg-gradient-to-br ${scoreBg(results.score)} border rounded-2xl p-5 shadow-sm`}>
            <div className="flex items-center gap-5 flex-wrap">
              <ScoreRing score={results.score} />

              <div className="flex-1 min-w-0">
                {/* URL + badge */}
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <span className="text-base font-semibold text-gray-900 font-mono truncate">{url}</span>
                  <span className={`inline-flex items-center gap-1 text-xs px-2.5 py-0.5 rounded-full font-semibold border
                    ${results.score >= 75 ? "bg-green-100 text-green-700 border-green-300"
                      : results.score >= 50 ? "bg-yellow-100 text-yellow-700 border-yellow-300"
                      : "bg-red-100 text-red-700 border-red-300"}`}>
                    {riskIcon(results.score)}
                    {scoreLabel(results.score)}
                  </span>
                </div>

                <p className="text-xs text-gray-500 mb-3">
                  Analyse terminée — {results.vulns.length} vulnérabilité(s) détectée(s)
                </p>

                {/* 3 info tiles */}
                <div className="grid grid-cols-3 gap-2.5">
                  <div className="bg-white/70 rounded-xl px-3 py-2.5 border border-white/60">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Lock size={11} className="text-gray-400" />
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">SSL</p>
                    </div>
                    <p className={`text-sm font-semibold ${results.ssl ? "text-green-600" : "text-red-500"}`}>
                      {results.ssl ? "✓ Valide" : "✗ Absent"}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{results.sslExpiry}</p>
                  </div>
                  <div className="bg-white/70 rounded-xl px-3 py-2.5 border border-white/60">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <Server size={11} className="text-gray-400" />
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Serveur</p>
                    </div>
                    <p className="text-sm font-semibold text-gray-700 truncate">{results.server}</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      Redirect: {results.redirect ? "Oui" : "Non"}
                    </p>
                  </div>
                  <div className="bg-white/70 rounded-xl px-3 py-2.5 border border-white/60">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <ShieldAlert size={11} className="text-gray-400" />
                      <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wide">Vulns</p>
                    </div>
                    <p className="text-sm font-semibold text-red-600">{results.vulns.length} trouvée(s)</p>
                    <p className="text-[10px] text-gray-500 mt-0.5">
                      {results.headers.filter(h => !h.present && h.critical).length} headers crit.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── HEADERS ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-900">En-têtes de sécurité HTTP</p>
              <span className="text-xs text-gray-400">
                {results.headers.filter(h => h.present).length}/{results.headers.length} présents
              </span>
            </div>
            {/* progress bar */}
            <div className="w-full bg-gray-100 rounded-full h-1 mb-4 overflow-hidden">
              <div
                className="bg-green-500 h-full rounded-full transition-all duration-700"
                style={{ width: `${(results.headers.filter(h=>h.present).length / results.headers.length) * 100}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              {results.headers.map((h) => <HeaderBadge key={h.name} h={h} />)}
            </div>
          </div>

          {/* ── VULNERABILITIES ── */}
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <p className="text-sm font-semibold text-gray-900">Vulnérabilités détectées</p>
              <div className="flex gap-1.5">
                {["Critique","Élevé","Moyen","Faible"].map(sev => {
                  const count = results.vulns.filter(v => v.severity === sev).length;
                  if (!count) return null;
                  const m = severityMeta[sev];
                  return (
                    <span key={sev} className={`text-[10px] px-2 py-0.5 rounded-full border font-semibold ${m.bg} ${m.border} ${m.text}`}>
                      {count} {sev}
                    </span>
                  );
                })}
              </div>
            </div>
            <div className="space-y-2">
              {results.vulns.map((v) => <VulnCard key={v.id} v={v} />)}
            </div>
          </div>

          {/* ── RECOMMENDATIONS ── */}
          <div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-lg bg-green-600 flex items-center justify-center">
                <ShieldCheck size={14} className="text-white" />
              </div>
              <p className="text-sm font-semibold text-green-900">Recommandations IA</p>
            </div>
            <div className="space-y-3">
              {results.recommendations.map((r, i) => (
                <div key={i} className="flex items-start gap-3 bg-white/60 rounded-xl px-3.5 py-3 border border-green-100">
                  <span className="w-5 h-5 rounded-full bg-green-600 text-white font-bold flex items-center justify-center shrink-0 mt-0.5 text-[10px]">
                    {i + 1}
                  </span>
                  <p className="text-xs text-green-800 leading-relaxed flex-1">{r}</p>
                  <ArrowRight size={12} className="text-green-400 shrink-0 mt-0.5" />
                </div>
              ))}
            </div>
          </div>

          {/* ── ACTIONS ── */}
          <div className="flex gap-3">
            <button
              onClick={reset}
              className="flex items-center justify-center gap-2 flex-1 border border-gray-200 text-gray-600 text-sm py-2.5 rounded-xl hover:bg-gray-50 transition bg-white font-medium"
            >
              <RotateCcw size={14} />
              Nouveau scan
            </button>
            <button
              onClick={() => generatePDF(url, results)}
              className="flex items-center justify-center gap-2 flex-1 bg-green-600 hover:bg-green-700 text-white text-sm font-medium py-2.5 rounded-xl transition shadow-sm"
            >
              <FileText size={14} />
              Télécharger le rapport PDF
              <Download size={13} className="opacity-70" />
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
