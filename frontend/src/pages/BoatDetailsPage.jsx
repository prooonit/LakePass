import { ArrowLeft, CalendarClock, CreditCard, Users } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as boatApi from "../api/boats";
import * as bookingApi from "../api/bookings";
import * as paymentApi from "../api/payments";
import LoadingSpinner from "../components/LoadingSpinner";
import StatusBadge from "../components/StatusBadge";

const images = {
  YACHT: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=1600&q=80",
  PONTOON: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=1600&q=80",
  SPEED_BOAT: "https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?auto=format&fit=crop&w=1600&q=80",
  FISHING_BOAT: "https://images.unsplash.com/photo-1510407857691-180bc78628cb?auto=format&fit=crop&w=1600&q=80",
  JET_SKI: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=1600&q=80",
  OTHER: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=1600&q=80",
};

export default function BoatDetailsPage() {
  const { boatId } = useParams();
  const [searchParams] = useSearchParams();
  const marinaSlug = searchParams.get("marina");
  const [boat, setBoat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState({ startTime: "", endTime: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadBoat = async () => {
      setLoading(true);

      try {
        setBoat(
          marinaSlug
            ? await boatApi.getBoatById(marinaSlug, boatId)
            : await boatApi.getBoatDetails(boatId)
        );
      } catch (error) {
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadBoat();
  }, [boatId, marinaSlug]);

  const estimatedTotal = useMemo(() => {
    const start = new Date(booking.startTime);
    const end = new Date(booking.endTime);

    if (!booking.startTime || !booking.endTime || end <= start || !boat?.hourlyRate) {
      return 0;
    }

    return ((end - start) / (1000 * 60 * 60)) * Number(boat.hourlyRate);
  }, [booking, boat]);

  const submitBooking = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      const created = await bookingApi.createBooking({
        boatId,
        startTime: booking.startTime,
        endTime: booking.endTime,
      });
      const url = await paymentApi.createCheckoutSession(created.id);

      if (!url) {
        throw new Error("Stripe checkout URL was not returned");
      }

      window.location.href = url;
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return <LoadingSpinner label="Loading boat" />;
  }

  if (!boat) {
    return (
      <main className="page-shell">
        <div className="rounded-lg border border-dashed border-stone-300 bg-white p-10 text-center">
          <h1 className="text-xl font-bold text-stone-950">Boat not found</h1>
          <Link to="/" className="mt-4 inline-flex text-sm font-bold text-rose-600">Back to search</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="page-shell">
      <Link to="/" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-stone-600 hover:text-stone-950">
        <ArrowLeft size={16} />
        Back to boats
      </Link>

      <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
        <section>
          <div className="overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-stone-200">
            <img
              src={images[boat.type] || images.OTHER}
              alt=""
              className="h-[320px] w-full object-cover sm:h-[440px]"
            />
          </div>
          <div className="mt-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h1 className="text-3xl font-black text-stone-950 sm:text-4xl">{boat.name}</h1>
                <p className="mt-2 text-stone-600">{boat.marina?.name || "Lake Pass marina"} - {boat.type?.replaceAll("_", " ")}</p>
              </div>
              <StatusBadge status={boat.status} />
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg border border-stone-200 bg-white p-4">
                <Users className="text-cyan-700" size={20} />
                <p className="mt-2 text-sm text-stone-500">Capacity</p>
                <p className="font-bold text-stone-950">{boat.capacity} guests</p>
              </div>
              <div className="rounded-lg border border-stone-200 bg-white p-4">
                <CreditCard className="text-cyan-700" size={20} />
                <p className="mt-2 text-sm text-stone-500">Rate</p>
                <p className="font-bold text-stone-950">${Number(boat.hourlyRate).toFixed(2)} / hour</p>
              </div>
              <div className="rounded-lg border border-stone-200 bg-white p-4">
                <CalendarClock className="text-cyan-700" size={20} />
                <p className="mt-2 text-sm text-stone-500">Boat code</p>
                <p className="font-bold text-stone-950">{boat.boatCode}</p>
              </div>
            </div>
            <p className="mt-6 leading-7 text-stone-700">{boat.description || "A ready-to-book Lake Pass boat for your next time on the water."}</p>
          </div>
        </section>

        <aside className="h-fit rounded-lg border border-stone-200 bg-white p-5 shadow-soft lg:sticky lg:top-24">
          <div className="flex items-end justify-between">
            <div>
              <p className="text-sm text-stone-500">From</p>
              <p className="text-2xl font-black text-stone-950">${Number(boat.hourlyRate).toFixed(0)} <span className="text-sm font-semibold text-stone-500">/ hour</span></p>
            </div>
          </div>
          <form onSubmit={submitBooking} className="mt-5 grid gap-4">
            <label className="grid gap-1">
              <span className="label">Start time</span>
              <input className="field" type="datetime-local" required value={booking.startTime} onChange={(event) => setBooking((current) => ({ ...current, startTime: event.target.value }))} />
            </label>
            <label className="grid gap-1">
              <span className="label">End time</span>
              <input className="field" type="datetime-local" required value={booking.endTime} onChange={(event) => setBooking((current) => ({ ...current, endTime: event.target.value }))} />
            </label>
            <div className="flex items-center justify-between rounded-lg bg-stone-50 p-3">
              <span className="text-sm font-semibold text-stone-600">Estimated total</span>
              <span className="font-black text-stone-950">${estimatedTotal.toFixed(2)}</span>
            </div>
            <button type="submit" className="btn-primary" disabled={submitting}>
              <CreditCard size={17} />
              {submitting ? "Opening checkout..." : "Book Now"}
            </button>
          </form>
        </aside>
      </div>
    </main>
  );
}
