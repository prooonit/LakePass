import { Edit, Plus, UserPlus } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import * as boatApi from "../api/boats";
import * as bookingApi from "../api/bookings";
import * as marinaApi from "../api/marinas";
import BookingTable from "../components/BookingTable";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import RoleBadge from "../components/RoleBadge";
import StatusBadge from "../components/StatusBadge";
import { useMarinas } from "../context/MarinaContext";

const boatTypes = ["YACHT", "PONTOON", "SPEED_BOAT", "FISHING_BOAT", "JET_SKI", "OTHER"];
const bookingStatuses = ["", "PENDING", "CONFIRMED", "CHECKED_IN", "CHECKED_OUT", "COMPLETED", "CANCELLED"];
const initialBoatForm = {
  name: "",
  boatCode: "",
  description: "",
  type: "PONTOON",
  capacity: "4",
  hourlyRate: "100",
  status: "ACTIVE",
};
const initialInviteForm = {
  email: "",
  role: "STAFF",
};

export default function MarinaDetailsPage() {
  const { slug } = useParams();
  const { marinas, loadMarinas, getMarinaBySlug } = useMarinas();
  const marina = getMarinaBySlug(slug);
  const canManageBoats = marina?.role === "OWNER" || marina?.role === "MANAGER";
  const canInviteMembers = marina?.role === "OWNER";
  const [tab, setTab] = useState("boats");
  const [boats, setBoats] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [editingBoat, setEditingBoat] = useState(null);
  const [boatForm, setBoatForm] = useState(initialBoatForm);
  const [inviteForm, setInviteForm] = useState(initialInviteForm);
  const [inviting, setInviting] = useState(false);
  const [busyId, setBusyId] = useState(null);

  useEffect(() => {
    if (!marinas.length) {
      loadMarinas().catch(() => {});
    }
  }, [marinas.length, loadMarinas]);

  const loadBoats = async () => {
    setLoading(true);

    try {
      const data = await boatApi.getMarinaBoats(slug);
      setBoats(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadBookings = async (nextStatus = status) => {
    setBookingLoading(true);

    try {
      const data = await bookingApi.getMarinaBookings(slug, nextStatus);
      setBookings(Array.isArray(data) ? data : []);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBookingLoading(false);
    }
  };

  useEffect(() => {
    loadBoats();
  }, [slug]);

  useEffect(() => {
    if (tab === "bookings") {
      loadBookings(status);
    }
  }, [tab, status, slug]);

  const openCreate = () => {
    setEditingBoat(null);
    setBoatForm(initialBoatForm);
    setModalOpen(true);
  };

  const openEdit = (boat) => {
    setEditingBoat(boat);
    setBoatForm({
      name: boat.name || "",
      boatCode: boat.boatCode || "",
      description: boat.description || "",
      type: boat.type || "PONTOON",
      capacity: String(boat.capacity || 1),
      hourlyRate: String(boat.hourlyRate || 0),
      status: boat.status || "ACTIVE",
    });
    setModalOpen(true);
  };

  const saveBoat = async (event) => {
    event.preventDefault();
    const payload = {
      ...boatForm,
      capacity: Number(boatForm.capacity),
      hourlyRate: Number(boatForm.hourlyRate),
    };

    try {
      if (editingBoat) {
        await boatApi.updateBoat(slug, editingBoat.id, payload);
        toast.success("Boat updated");
      } else {
        await boatApi.createBoat(slug, payload);
        toast.success("Boat added");
      }
      setModalOpen(false);
      await loadBoats();
    } catch (error) {
      toast.error(error.message);
    }
  };

  const inviteMember = async (event) => {
    event.preventDefault();
    setInviting(true);

    try {
      await marinaApi.inviteMarinaMember(slug, inviteForm);
      toast.success(`${inviteForm.email} added as ${inviteForm.role.toLowerCase()}`);
      setInviteForm(initialInviteForm);
      setInviteModalOpen(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setInviting(false);
    }
  };

  const doCheckIn = async (bookingId) => {
    setBusyId(bookingId);
    try {
      await bookingApi.checkInBooking(bookingId);
      toast.success("Booking checked in");
      await loadBookings(status);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusyId(null);
    }
  };

  const doCheckOut = async (bookingId) => {
    setBusyId(bookingId);
    try {
      await bookingApi.checkOutBooking(bookingId);
      toast.success("Booking checked out");
      await loadBookings(status);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setBusyId(null);
    }
  };

  const selectedStatusLabel = useMemo(() => status || "All statuses", [status]);

  return (
    <main className="page-shell">
      <section className="mb-6 rounded-lg bg-stone-950 p-6 text-white">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-white/70">Marina</p>
            <h1 className="mt-1 text-3xl font-black">{marina?.name || slug}</h1>
            <p className="mt-2 text-white/70">/{slug}</p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {marina?.role && <RoleBadge role={marina.role} />}
            {canInviteMembers && (
              <button
                type="button"
                className="btn-secondary border-white/20 bg-white/10 text-white hover:bg-white/20"
                onClick={() => setInviteModalOpen(true)}
              >
                <UserPlus size={17} />
                Invite
              </button>
            )}
          </div>
        </div>
      </section>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
        <div className="flex rounded-lg border border-stone-200 bg-white p-1">
          {["boats", "bookings"].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setTab(item)}
              className={`rounded-md px-4 py-2 text-sm font-bold capitalize ${tab === item ? "bg-stone-950 text-white" : "text-stone-600 hover:bg-stone-50"}`}
            >
              {item}
            </button>
          ))}
        </div>
        {tab === "boats" && canManageBoats && (
          <button type="button" className="btn-primary" onClick={openCreate}>
            <Plus size={17} />
            Add Boat
          </button>
        )}
        {tab === "bookings" && (
          <select className="field max-w-56" value={status} onChange={(event) => setStatus(event.target.value)} aria-label="Filter bookings by status">
            {bookingStatuses.map((item) => (
              <option key={item || "ALL"} value={item}>{item ? item.replaceAll("_", " ") : "All statuses"}</option>
            ))}
          </select>
        )}
      </div>

      {tab === "boats" && (
        loading ? <LoadingSpinner label="Loading marina boats" /> : boats.length ? (
          <div className="grid gap-4 lg:grid-cols-2">
            {boats.map((boat) => (
              <div key={boat.id} className="rounded-lg border border-stone-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="font-bold text-stone-950">{boat.name}</h3>
                    <p className="mt-1 text-sm text-stone-500">{boat.boatCode} - {boat.type?.replaceAll("_", " ")}</p>
                  </div>
                  <StatusBadge status={boat.status} />
                </div>
                <p className="mt-4 line-clamp-2 text-sm text-stone-600">{boat.description || "No description provided."}</p>
                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="font-semibold text-stone-700">{boat.capacity} guests</span>
                  <span className="font-black text-stone-950">${Number(boat.hourlyRate).toFixed(2)} / hour</span>
                </div>
                {canManageBoats && (
                  <button type="button" className="btn-secondary mt-4 w-full" onClick={() => openEdit(boat)}>
                    <Edit size={16} />
                    Edit Boat
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg border border-dashed border-stone-300 bg-white p-10 text-center">
            <h3 className="text-lg font-bold text-stone-950">No boats yet</h3>
            <p className="mt-2 text-stone-600">Add a boat to start accepting bookings.</p>
          </div>
        )
      )}

      {tab === "bookings" && (
        <>
          <p className="mb-3 text-sm font-semibold text-stone-600">Showing {selectedStatusLabel.replaceAll("_", " ").toLowerCase()}</p>
          {bookingLoading ? (
            <LoadingSpinner label="Loading marina bookings" />
          ) : (
            <BookingTable bookings={bookings} mode="marina" onCheckIn={doCheckIn} onCheckOut={doCheckOut} busyId={busyId} />
          )}
        </>
      )}

      <Modal title={editingBoat ? "Edit Boat" : "Add Boat"} open={modalOpen} onClose={() => setModalOpen(false)}>
        <form onSubmit={saveBoat} className="grid gap-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1">
              <span className="label">Name</span>
              <input className="field" required value={boatForm.name} onChange={(event) => setBoatForm((current) => ({ ...current, name: event.target.value }))} />
            </label>
            <label className="grid gap-1">
              <span className="label">Boat code</span>
              <input className="field" required disabled={Boolean(editingBoat)} value={boatForm.boatCode} onChange={(event) => setBoatForm((current) => ({ ...current, boatCode: event.target.value }))} />
            </label>
            <label className="grid gap-1">
              <span className="label">Type</span>
              <select className="field" value={boatForm.type} onChange={(event) => setBoatForm((current) => ({ ...current, type: event.target.value }))}>
                {boatTypes.map((type) => <option key={type} value={type}>{type.replaceAll("_", " ")}</option>)}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="label">Status</span>
              <select className="field" value={boatForm.status} onChange={(event) => setBoatForm((current) => ({ ...current, status: event.target.value }))}>
                {["ACTIVE", "MAINTENANCE", "INACTIVE"].map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </label>
            <label className="grid gap-1">
              <span className="label">Capacity</span>
              <input className="field" required min="1" type="number" value={boatForm.capacity} onChange={(event) => setBoatForm((current) => ({ ...current, capacity: event.target.value }))} />
            </label>
            <label className="grid gap-1">
              <span className="label">Hourly rate</span>
              <input className="field" required min="0" step="0.01" type="number" value={boatForm.hourlyRate} onChange={(event) => setBoatForm((current) => ({ ...current, hourlyRate: event.target.value }))} />
            </label>
          </div>
          <label className="grid gap-1">
            <span className="label">Description</span>
            <textarea className="field min-h-24" value={boatForm.description} onChange={(event) => setBoatForm((current) => ({ ...current, description: event.target.value }))} />
          </label>
          <div className="flex justify-end gap-3">
            <button type="button" className="btn-secondary" onClick={() => setModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary">{editingBoat ? "Save Changes" : "Add Boat"}</button>
          </div>
        </form>
      </Modal>

      <Modal title="Invite Member" open={inviteModalOpen} onClose={() => setInviteModalOpen(false)}>
        <form onSubmit={inviteMember} className="grid gap-4">
          <label className="grid gap-1">
            <span className="label">Email</span>
            <input
              className="field"
              type="email"
              required
              value={inviteForm.email}
              onChange={(event) => setInviteForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="teammate@example.com"
            />
          </label>
          <label className="grid gap-1">
            <span className="label">Role</span>
            <select
              className="field"
              value={inviteForm.role}
              onChange={(event) => setInviteForm((current) => ({ ...current, role: event.target.value }))}
            >
              <option value="STAFF">Staff</option>
              <option value="MANAGER">Manager</option>
            </select>
          </label>
          <div className="rounded-lg bg-stone-50 p-3 text-sm text-stone-600">
            The person must sign in to Lake Pass once before they can be added to this marina.
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" className="btn-secondary" onClick={() => setInviteModalOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={inviting}>
              <UserPlus size={17} />
              {inviting ? "Inviting..." : "Invite Member"}
            </button>
          </div>
        </form>
      </Modal>
    </main>
  );
}
