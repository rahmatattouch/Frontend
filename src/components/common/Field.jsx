/**
 * Settings-row layout – a label on the left, control on the right.
 * Shared between Settings and AdminSettings pages.
 */
export default function Field({ label, desc, children }) {
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
