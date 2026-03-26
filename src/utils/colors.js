/**
 * Shared color/styling utilities used across multiple pages.
 * Centralised here to avoid code duplication.
 */

/** Returns a hex colour based on a 0-100 security score. */
export const scoreColor = (score) =>
  score >= 75 ? "#16a34a" : score >= 50 ? "#eab308" : "#ef4444";

/** Returns Tailwind classes for a risk-level badge. */
export const riskBadgeClass = (risk) => {
  const map = {
    Critique: "bg-red-100 text-red-700 border-red-200",
    Élevé:    "bg-orange-100 text-orange-700 border-orange-200",
    Moyen:    "bg-yellow-100 text-yellow-700 border-yellow-200",
    Faible:   "bg-green-100 text-green-700 border-green-200",
    // English variants
    critical: "bg-red-100 text-red-700 border-red-200",
    high:     "bg-orange-100 text-orange-700 border-orange-200",
    medium:   "bg-yellow-100 text-yellow-700 border-yellow-200",
    low:      "bg-green-100 text-green-700 border-green-200",
  };
  return map[risk] ?? "bg-gray-100 text-gray-600 border-gray-200";
};

/** Returns Tailwind text-colour class for a user status string. */
export const statusTextClass = (status) => {
  const map = {
    Actif:     "text-green-700",
    active:    "text-green-700",
    Inactif:   "text-gray-400",
    inactive:  "text-gray-400",
    Suspendu:  "text-red-500",
    suspended: "text-red-500",
  };
  return map[status] ?? "text-gray-400";
};

/** Returns Tailwind background-colour class for a user-status dot. */
export const statusDotClass = (status) => {
  const map = {
    Actif:     "bg-green-500",
    active:    "bg-green-500",
    Inactif:   "bg-gray-400",
    inactive:  "bg-gray-400",
    Suspendu:  "bg-red-500",
    suspended: "bg-red-500",
  };
  return map[status] ?? "bg-gray-400";
};
