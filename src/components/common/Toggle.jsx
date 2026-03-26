/**
 * Toggle switch component – shared between Settings and AdminSettings.
 */
export default function Toggle({ value, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={`relative w-10 h-5 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-green-500/30 ${
        value ? "bg-green-600" : "bg-gray-200"
      }`}
    >
      <span
        className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white transition-transform shadow-sm ${
          value ? "translate-x-5" : ""
        }`}
      />
    </button>
  );
}
