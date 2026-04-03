import { useEffect, useMemo, useState } from "react";
import { Search, ExternalLink, ChevronRight, Filter } from "lucide-react";
import { getAllAuditsAdmin } from "../services/authService";

const normalizeRiskLabel = (risk) => {
  const r = (risk ?? "").toString().trim().toLowerCase();
  if (r === "critical" || r === "critique") return "Critique";
  if (r === "high" || r === "élevé" || r === "eleve" || r === "éleve") return "Élevé";
  if (r === "medium" || r === "moyen") return "Moyen";
  if (r === "low" || r === "faible") return "Faible";
  return "Inconnu";
};

const riskColor = {
  Faible: "bg-green-100 text-green-700 border-green-200",
  Moyen: "bg-yellow-100 text-yellow-700 border-yellow-200",
  "Élevé": "bg-orange-100 text-orange-700 border-orange-200",
  Critique: "bg-red-100 text-red-700 border-red-200",
  Inconnu: "bg-gray-100 text-gray-600 border-gray-200",
};

const normalizeScore = (s) => {
  const n = Number(s);
  if (!Number.isFinite(n)) return 0;
  if (n >= 0 && n <= 10) return Math.round(n * 10);
  return Math.max(0, Math.min(100, Math.round(n)));
};

const scoreColor = (s) => {
  const x = normalizeScore(s);
  return x >= 75 ? "#16a34a" : x >= 50 ? "#eab308" : "#ef4444";
};

export default function AdminAudits() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [search, setSearch] = useState("");
  const [filterRisk, setFilterRisk] = useState("Tous");
  const [selected, setSelected] = useState(null);

  const fetchAudits = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getAllAuditsAdmin();
      const list = Array.isArray(data) ? data : data?.audits || [];

      // normalisation côté front (sécurité)
      const normalized = list.map((a) => ({
        ...a,
        id: a.id || a._id || a.auditId,
        site: a.site || a.urlCible || "—",
        score: normalizeScore(a.score),
        risk: normalizeRiskLabel(a.risk),
        ssl: typeof a.ssl === "boolean" ? a.ssl : /^https:\/\//i.test(String(a.site || "")),
        vulns: Number(a.vulns ?? 0) || 0,
        headers: Number(a.headers ?? 0) || 0,
        status: a.status || a.statut || "—",
        date: a.date || "—",
        user: a.user || "—",
      }));

      setAudits(normalized);
    } catch (err) {
      console.error(err);
      setError(err?.message || "Impossible de charger les audits");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAudits();
  }, []);

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();
    return audits.filter((a) => {
      const matchSearch =
        !q ||
        String(a.site || "").toLowerCase().includes(q) ||
        String(a.id || "").toLowerCase().includes(q);

      const matchRisk = filterRisk === "Tous" || a.risk === filterRisk;
      return matchSearch && matchRisk;
    });
  }, [audits, search, filterRisk]);

  return (
    <div className="p-6 space-y-6 relative">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">Audits</h1>
        <p className="text-sm text-gray-500 mt-0.5">{audits.length} audits enregistrés</p>
        {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
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
        <button
          onClick={fetchAudits}
          className="text-xs px-3 py-1.5 rounded-lg border transition border-gray-200 text-gray-500 hover:text-gray-700 bg-white"
        >
          Rafraîchir
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="text-center py-12 text-gray-400 text-sm">Chargement...</div>
        ) : (
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
                <tr
                  key={a.id}
                  className="hover:bg-gray-50 cursor-pointer transition"
                  onClick={() => setSelected(a)}
                >
                  <td className="px-4 py-3 text-xs text-gray-400 font-mono">{String(a.id).slice(-8)}</td>
                  <td className="px-4 py-3 text-gray-900 font-medium">{a.site}</td>

                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <svg width="36" height="36" viewBox="0 0 36 36">
                        <circle cx="18" cy="18" r="15" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                        <circle
                          cx="18"
                          cy="18"
                          r="15"
                          fill="none"
                          stroke={scoreColor(a.score)}
                          strokeWidth="3"
                          strokeDasharray={`${(a.score / 100) * 94} 94`}
                          strokeLinecap="round"
                          transform="rotate(-90 18 18)"
                        />
                        <text x="18" y="22" textAnchor="middle" fontSize="9" fill={scoreColor(a.score)} fontWeight="600">
                          {a.score}
                        </text>
                      </svg>
                    </div>
                  </td>

                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-md border ${riskColor[a.risk] || riskColor.Inconnu}`}>
                      {a.risk}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span className={`text-xs font-medium ${a.ssl ? "text-green-600" : "text-red-500"}`}>
                      {a.ssl ? "✓ HTTPS" : "✗ HTTP"}
                    </span>
                  </td>

                  <td className="px-4 py-3">
                    <span
                      className={`text-sm font-semibold ${
                        a.vulns > 10 ? "text-red-500" : a.vulns > 5 ? "text-yellow-600" : "text-gray-700"
                      }`}
                    >
                      {a.vulns}
                    </span>
                    <span className="text-xs text-gray-400 ml-1">trouvées</span>
                  </td>

                  <td className="px-4 py-3">
                    <span className={`text-xs ${a.status === "En cours" ? "text-amber-600" : "text-gray-400"}`}>
                      {a.status === "En cours" ? "● " : "○ "}
                      {a.status}
                    </span>
                  </td>

                  <td className="px-4 py-3 text-xs text-gray-400">{a.date}</td>
                  <td className="px-4 py-3">
                    <ChevronRight size={14} className="text-gray-300" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">Aucun audit trouvé</div>
        )}
      </div>

      {/* Detail panel */}
      {selected && (
        <div className="fixed inset-y-0 right-0 w-80 bg-white border-l border-gray-200 z-40 overflow-y-auto shadow-xl">
          <div className="p-5 space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-900">Détails de l'audit</h2>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-700 text-xs">
                ✕
              </button>
            </div>

            <div className="text-center py-4">
              <svg width="80" height="80" viewBox="0 0 80 80" className="mx-auto">
                <circle cx="40" cy="40" r="34" fill="none" stroke="#e5e7eb" strokeWidth="6" />
                <circle
                  cx="40"
                  cy="40"
                  r="34"
                  fill="none"
                  stroke={scoreColor(selected.score)}
                  strokeWidth="6"
                  strokeDasharray={`${(selected.score / 100) * 213} 213`}
                  strokeLinecap="round"
                  transform="rotate(-90 40 40)"
                />
                <text x="40" y="46" textAnchor="middle" fontSize="20" fill={scoreColor(selected.score)} fontWeight="700">
                  {selected.score}
                </text>
              </svg>
              <p className="text-gray-900 font-medium mt-2">{selected.site}</p>
              <p className="text-xs text-gray-400">{selected.id}</p>
            </div>

            <div className="space-y-2">
              {[
                [
                  "Niveau de risque",
                  <span className={`text-xs px-2 py-0.5 rounded border ${riskColor[selected.risk] || riskColor.Inconnu}`}>
                    {selected.risk}
                  </span>,
                ],
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