import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as bookingApi from "../api/bookings";
import BookingTable from "../components/BookingTable";
import LoadingSpinner from "../components/LoadingSpinner";

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      try {
        const data = await bookingApi.getMyBookings();
        setBookings(Array.isArray(data) ? data : []);
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  return (
    <main className="page-shell">
      <div className="mb-6">
        <h1 className="section-title">My Bookings</h1>
        <p className="mt-1 text-stone-600">Track reservation status, payment status, and boat details.</p>
      </div>
      {loading ? <LoadingSpinner label="Loading bookings" /> : <BookingTable bookings={bookings} />}
    </main>
  );
}
