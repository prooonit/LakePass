const styles = {
  PENDING: "bg-amber-50 text-amber-700 ring-amber-200",
  CONFIRMED: "bg-sky-50 text-sky-700 ring-sky-200",
  CHECKED_IN: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  CHECKED_OUT: "bg-indigo-50 text-indigo-700 ring-indigo-200",
  COMPLETED: "bg-stone-100 text-stone-700 ring-stone-200",
  CANCELLED: "bg-red-50 text-red-700 ring-red-200",
  PAID: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  FAILED: "bg-red-50 text-red-700 ring-red-200",
  REFUNDED: "bg-purple-50 text-purple-700 ring-purple-200",
  ACTIVE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  MAINTENANCE: "bg-amber-50 text-amber-700 ring-amber-200",
  INACTIVE: "bg-stone-100 text-stone-700 ring-stone-200",
};

export default function StatusBadge({ status }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${
        styles[status] || "bg-stone-100 text-stone-700 ring-stone-200"
      }`}
    >
      {String(status || "UNKNOWN").replaceAll("_", " ")}
    </span>
  );
}
