import { Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import MarinaCard from "../components/MarinaCard";
import LoadingSpinner from "../components/LoadingSpinner";
import Modal from "../components/Modal";
import { useMarinas } from "../context/MarinaContext";

export default function MyMarinasPage() {
  const { marinas, loading, loadMarinas, createMarina } = useMarinas();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", slug: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadMarinas().catch(() => {});
  }, [loadMarinas]);

  const submit = async (event) => {
    event.preventDefault();
    setSubmitting(true);

    try {
      await createMarina({
        name: form.name,
        ...(form.slug ? { slug: form.slug } : {}),
      });
      setForm({ name: "", slug: "" });
      setOpen(false);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="page-shell">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="section-title">My Marinas</h1>
          <p className="mt-1 text-stone-600">All marinas associated with your account.</p>
        </div>
        <button type="button" className="btn-primary" onClick={() => setOpen(true)}>
          <Plus size={17} />
          Create Marina
        </button>
      </div>

      {loading ? (
        <LoadingSpinner label="Loading marinas" />
      ) : marinas.length ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {marinas.map((marina) => <MarinaCard key={marina.id} marina={marina} />)}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-stone-300 bg-white p-10 text-center">
          <h3 className="text-lg font-bold text-stone-950">No marinas yet</h3>
          <p className="mt-2 text-stone-600">Create your first marina to manage boats and bookings.</p>
        </div>
      )}

      <Modal title="Create Marina" open={open} onClose={() => setOpen(false)}>
        <form onSubmit={submit} className="grid gap-4">
          <label className="grid gap-1">
            <span className="label">Name</span>
            <input className="field" required value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))} placeholder="North Dock Marina" />
          </label>
          <label className="grid gap-1">
            <span className="label">Slug</span>
            <input className="field" value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} placeholder="north-dock" />
          </label>
          <div className="flex justify-end gap-3">
            <button type="button" className="btn-secondary" onClick={() => setOpen(false)}>Cancel</button>
            <button type="submit" className="btn-primary" disabled={submitting}>{submitting ? "Creating..." : "Create"}</button>
          </div>
        </form>
      </Modal>
    </main>
  );
}
