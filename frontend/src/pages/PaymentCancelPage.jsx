import { XCircle } from "lucide-react";
import { Link } from "react-router-dom";

export default function PaymentCancelPage() {
  return (
    <main className="page-shell">
      <div className="mx-auto max-w-xl rounded-lg border border-amber-200 bg-white p-8 text-center shadow-soft">
        <XCircle className="mx-auto text-amber-600" size={48} />
        <h1 className="mt-4 text-2xl font-black text-stone-950">Payment cancelled</h1>
        <p className="mt-2 text-stone-600">No charge was completed. You can try booking again whenever you are ready.</p>
        <Link to="/" className="btn-primary mt-6">Back to boats</Link>
      </div>
    </main>
  );
}
