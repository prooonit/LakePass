import { LogIn, LogOut } from "lucide-react";
import StatusBadge from "./StatusBadge";

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat(undefined, {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(new Date(value))
    : "Not set";

export default function BookingTable({ bookings, mode = "guest", onCheckIn, onCheckOut, busyId }) {
  if (!bookings.length) {
    return (
      <div className="rounded-lg border border-dashed border-stone-300 bg-white p-8 text-center">
        <h3 className="font-bold text-stone-950">No bookings found</h3>
        <p className="mt-2 text-sm text-stone-600">Bookings will appear here when they match this view.</p>
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-stone-200 bg-white">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-stone-200 text-sm">
          <thead className="bg-stone-50 text-left text-xs font-bold uppercase tracking-wide text-stone-500">
            <tr>
              <th className="px-4 py-3">Boat</th>
              {mode === "marina" && <th className="px-4 py-3">Guest</th>}
              <th className="px-4 py-3">Start</th>
              <th className="px-4 py-3">End</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3 text-right">Total</th>
              {mode === "marina" && <th className="px-4 py-3 text-right">Actions</th>}
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {bookings.map((booking) => (
              <tr key={booking.id} className="align-top">
                <td className="px-4 py-4">
                  <p className="font-bold text-stone-950">{booking.boat?.name || "Boat"}</p>
                  <p className="text-xs text-stone-500">{booking.boat?.type || booking.boat?.marina?.name}</p>
                </td>
                {mode === "marina" && (
                  <td className="px-4 py-4">
                    <p className="font-semibold text-stone-800">{booking.user?.name || "Guest"}</p>
                    <p className="text-xs text-stone-500">{booking.user?.email}</p>
                  </td>
                )}
                <td className="whitespace-nowrap px-4 py-4 text-stone-700">{formatDate(booking.startTime)}</td>
                <td className="whitespace-nowrap px-4 py-4 text-stone-700">{formatDate(booking.endTime)}</td>
                <td className="px-4 py-4"><StatusBadge status={booking.status} /></td>
                <td className="px-4 py-4"><StatusBadge status={booking.paymentStatus} /></td>
                <td className="whitespace-nowrap px-4 py-4 text-right font-bold text-stone-950">
                  ${Number(booking.totalPrice || 0).toFixed(2)}
                </td>
                {mode === "marina" && (
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        className="btn-secondary px-3 py-2"
                        disabled={booking.status !== "CONFIRMED" || busyId === booking.id}
                        onClick={() => onCheckIn?.(booking.id)}
                      >
                        <LogIn size={15} />
                        Check in
                      </button>
                      <button
                        type="button"
                        className="btn-secondary px-3 py-2"
                        disabled={booking.status !== "CHECKED_IN" || busyId === booking.id}
                        onClick={() => onCheckOut?.(booking.id)}
                      >
                        <LogOut size={15} />
                        Check out
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
