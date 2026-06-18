import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function PaymentSuccessPage() {
  return (
    <main className="page-shell">
      <div className="mx-auto max-w-xl rounded-lg border border-emerald-200 bg-white p-8 text-center shadow-soft">
        <CheckCircle2 className="mx-auto text-emerald-600" size={48} />
        <h1 className="mt-4 text-2xl font-black text-stone-950">Payment successful</h1>
        <p className="mt-2 text-stone-600">Your booking is ready. You can review it from My Bookings.</p>
        <Link to="/my-bookings" className="btn-primary mt-6">View bookings</Link>
      </div>
    </main>
  );
}
