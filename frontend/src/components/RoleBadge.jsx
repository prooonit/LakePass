const styles = {
  OWNER: "bg-rose-50 text-rose-700 ring-rose-200",
  MANAGER: "bg-blue-50 text-blue-700 ring-blue-200",
  STAFF: "bg-stone-100 text-stone-700 ring-stone-200",
};

export default function RoleBadge({ role }) {
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-bold ring-1 ${
        styles[role] || styles.STAFF
      }`}
    >
      {role || "STAFF"}
    </span>
  );
}
