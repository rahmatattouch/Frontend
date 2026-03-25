import { useState } from "react";
import { Search, ExternalLink, ChevronRight, Filter } from "lucide-react";

const audits = [
  { id: "AUD-001", site: "example.com", score: 82, risk: "Faible", ssl: true, headers: 7, vulns: 2, status: "Terminé", date: "24/03/2026", user: "Ahmed B." },
  { id: "AUD-002", site: "shop.tn", score: 41, risk: "Critique", ssl: false, headers: 2, vulns: 14, status: "Terminé", date: "23/03/2026", user: "Sonia T." },
  { id: "AUD-003", site: "api.myapp.io", score: 67, risk: "Moyen", ssl: true, headers: 5, vulns: 6, status: "En cours", date: "23/03/2026", user: "Fatma J." },
  { id: "AUD-004", site: "portal.corp.fr", score: 90, risk: "Faible", ssl: true, headers: 9, vulns: 1, status: "Terminé", date: "22/03/2026", user: "Ahmed B." },
  { id: "AUD-005", site: "beta.saas.co", score: 55, risk: "Élevé", ssl: true, headers: 3, vulns: 9, status: "Terminé", date: "21/03/2026", user: "Karim N." },
  { id: "AUD-006", site: "intranet.gov.tn", score: 38, risk: "Critique", ssl: false, headers: 1, vulns: 17, status: "Terminé", date: "20/03/2026", user: "Sonia T." },
  { id: "AUD-007", site: "dev.startup.io", score: 74, risk: "Moyen", ssl: true, headers: 6, vulns: 4, status: "En cours", date: "19/03/2026", user: "Fatma J." },
];

const riskColor = {
  Faible: "bg-green-100 text-green-700 border-green-200",
  Moyen: "bg-yellow-100 text-yellow-700 border-yellow-200",
  Élevé: "bg-orange-100 text-orange-700 border-orange-200",
  Critique: "bg-red-100 text-red-700 border-red-200",
};

const scoreColor = (s) => s >= 75 ? "#16a34a" : s >= 50 ? "#eab308" : "#ef4444";

export default function AdminAudits() {
  const [search, setSearch] = useState("");
  const [filterRisk, setFilterRisk] = useState("Tous");
  const [selected, setSelected] = useState(null);

  const filtered = audits.filter((a) => {
    const matchSearch = a.site.includes(search) || a.id.includes(search);
    const matchRisk = filterRisk === "Tous" || a.risk === filterRisk;
    return matchSearch && matchRisk;
  });

  return (
    <div className="p-6 space-y-6 relative">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Audits</h1>
        <p className="text-sm text-gray-500 mt-0.5">{audits.length} audits enregistrés</p>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 max-w-xs">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Site ou ID..."
            className="w-full bg-white border border-gray-200 rounded-lg pl-9 pr-3 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/20 focus:border-green-400"
          />
        </div>
        <Filter size={14} className="text-gray-400" />
        {["Tous", "Critique", "Élevé", "Moyen", "Faible"].map((r) => (
          <button
            key={r}
            onClick={() => setFilterRisk(r)}
            className={`text-xs px-3 py-1.5 rounded-lg border transition ${
              filterRisk === r
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
            <tr className="border-b border-gray-100 text-xs text-gray-400 bg-gray-50">
              <th className="text-left px-4 py-3 font-normal">ID</th>
              <th className="text-left px-4 py-3 font-normal">Site</th>
              <th className="text-left px-4 py-3 font-normal">Score</th>
              <th className="text-left px-4 py-3 font-normal">Risque</th>
              <th className="text-left px-4 py-3 font-normal">SSL</th>
              <th className="text-left px-4 py-3 font-normal">Vulnérabilités</th>
              <th className="text-left px-4 py-3 font-normal">Statut</th>
              <th className="text-left px-4 py-3 font-normal">Date</th>
              <th className="px-4 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50 cursor-pointer transition" onClick={() => setSelected(a)}>
                <td className="px-4 py-3 text-xs text-gray-400 font-mono">{a.id}</td>
                <td className="px-4 py-3 text-gray-900 font-medium">{a.site}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <svg width="36" height="36" viewBox="0 0 36 36">
                      <circle cx="18" cy="18" r="15" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                      <circle cx="18" cy="18" r="15" fill="none" stroke={scoreColor(a.score)} strokeWidth="3"
                        strokeDasharray={`${(a.score / 100) * 94} 94`} strokeLinecap="round" transform="rotate(-90 18 18)" />
                      <text x="18" y="22" textAnchor="middle" fontSize="9" fill={scoreColor(a.score)} fontWeight="600">{a.score}</text>
                    </svg>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs px-2 py-0.5 rounded-md border ${riskColor[a.risk]}`}>{a.risk}</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-medium ${a.ssl ? "text-green-600" : "text-red-500"}`}>
                    {a.ssl ? "✓ HTTPS" : "✗ HTTP"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-sm font-semibold ${a.vulns > 10 ? "text-red-500" : a.vulns > 5 ? "text-yellow-600" : "text-gray-700"}`}>
                    {a.vulns}
                  </span>
                  <span className="text-xs text-gray-400 ml-1">trouvées</span>
                </td>
                <td className="px-4 py-3">
                  <span className={`text-xs ${a.status === "En cours" ? "text-amber-600" : "text-gray-400"}`}>
                    {a.status === "En cours" ? "● " : "○ "}{a.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">{a.date}</td>
                <td className="px-4 py-3"><ChevronRight size={14} className="text-gray-300" /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-gray-200 z-40 overflow-y-auto shadow-xl">
          <div className="p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Détails de l'audit</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 text-xs">✕</button>
            </div>

            <div className="text-center py-4">
              <svg width="80" height="80" viewBox="0 0 80 80" className="mx-auto">
                <circle cx="40" cy="40" r="34" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                <circle cx="40" cy="40" r="34" fill="none" stroke={scoreColor(selected.score)} strokeWidth="6"
                  strokeDasharray={`${(selected.score / 100) * 213} 213`} strokeLinecap="round" transform="rotate(-90 40 40)" />
                <text x="40" y="46" textAnchor="middle" fontSize="20" fill={scoreColor(selected.score)} fontWeight="700">{selected.score}</text>
              </svg>
              <p className="text-gray-900 font-medium mt-2">{selected.site}</p>
              <p className="text-xs text-gray-400">{selected.id}</p>
            </div>

            <div className="space-y-2">
              {[
                ["Niveau de risque", <span className={`text-xs px-2 py-0.5 rounded border ${riskColor[selected.risk]}`}>{selected.risk}</span>],
                ["SSL/HTTPS", <span className={selected.ssl ? "text-green-600 text-xs" : "text-red-500 text-xs"}>{selected.ssl ? "✓ Activé" : "✗ Absent"}</span>],
                ["En-têtes analysés", <span className="text-gray-700 text-xs">{selected.headers}/10</span>],
                ["Vulnérabilités", <span className="text-red-500 font-semibold text-xs">{selected.vulns}</span>],
                ["Analyste", <span className="text-gray-700 text-xs">{selected.user}</span>],
                ["Date", <span className="text-gray-400 text-xs">{selected.date}</span>],
              ].map(([label, val], i) => (
                <div key={i} className="flex items-center justify-between py-2 border-b border-gray-100">
                  <span className="text-xs text-gray-400">{label}</span>
                  <span>{val}</span>
                </div>
              ))}
            </div>

            <div>
              <p className="text-xs text-gray-400 mb-2">Recommandations</p>
              <ul className="space-y-2">
                {!selected.ssl && (
                  <li className="text-xs text-orange-700 bg-orange-50 border border-orange-200 rounded-lg px-3 py-2">Activer HTTPS avec un certificat TLS valide</li>
                )}
                {selected.headers < 5 && (
                  <li className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-lg px-3 py-2">Ajouter les en-têtes de sécurité manquants (CSP, HSTS…)</li>
                )}
                {selected.vulns > 5 && (
                  <li className="text-xs text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">Corriger les {selected.vulns} vulnérabilités détectées en priorité</li>
                )}
                {selected.score >= 75 && (
                  <li className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">Configuration globalement sécurisée — maintenir les mises à jour</li>
                )}
              </ul>
            </div>

            <button className="w-full flex items-center justify-center gap-2 border border-gray-200 text-gray-500 text-xs py-2.5 rounded-lg hover:bg-gray-50 transition">
              <ExternalLink size={13} />
              Télécharger le rapport PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
}