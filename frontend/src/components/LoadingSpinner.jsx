export default function LoadingSpinner({ label = "Loading" }) {
  return (
    <div className="flex min-h-40 items-center justify-center gap-3 text-sm font-medium text-stone-600">
      <span className="h-6 w-6 animate-spin rounded-full border-2 border-stone-200 border-t-rose-600" />
      <span>{label}</span>
    </div>
  );
}
