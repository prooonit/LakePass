import { Search, SlidersHorizontal } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import * as boatApi from "../api/boats";
import BoatCard from "../components/BoatCard";
import LoadingSpinner from "../components/LoadingSpinner";

const initialFilters = {
  type: "",
  capacity: "",
  minPrice: "",
  maxPrice: "",
};

const boatTypes = ["YACHT", "PONTOON", "SPEED_BOAT", "FISHING_BOAT", "JET_SKI", "OTHER"];

export default function HomePage() {
  const [boats, setBoats] = useState([]);
  const [allBoats, setAllBoats] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [loading, setLoading] = useState(true);

  const applyFilters = (items, nextFilters) => {
    return items.filter((boat) => {
      const hourlyRate = Number(boat.hourlyRate);
      const capacity = Number(boat.capacity);

      return (
        (!nextFilters.type || boat.type === nextFilters.type) &&
        (!nextFilters.capacity || capacity >= Number(nextFilters.capacity)) &&
        (!nextFilters.minPrice || hourlyRate >= Number(nextFilters.minPrice)) &&
        (!nextFilters.maxPrice || hourlyRate <= Number(nextFilters.maxPrice))
      );
    });
  };

  const loadBoats = async () => {
    setLoading(true);

    try {
      const data = await boatApi.getAllBoats();
      const items = Array.isArray(data) ? data : [];

      setAllBoats(items);
      setBoats(applyFilters(items, initialFilters));
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBoats();
  }, []);

  const updateFilter = (key, value) => {
    setFilters((current) => ({ ...current, [key]: value }));
  };

  const onSubmit = (event) => {
    event.preventDefault();
    setBoats(applyFilters(allBoats, filters));
  };

  return (
    <main>
      <section className="relative min-h-[420px] bg-stone-900">
        <img
          src="https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1800&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-stone-950/25 to-stone-950/5" />
        <div className="page-shell relative flex min-h-[420px] items-end pb-10 text-white">
          <div className="max-w-2xl">
            <h1 className="text-4xl font-black tracking-normal sm:text-6xl">Book the lake by the hour</h1>
            <p className="mt-4 text-lg leading-8 text-white/88">
              Search active boats across your Lake Pass marinas and reserve the time that fits.
            </p>
          </div>
        </div>
      </section>

      <section className="page-shell">
        <form onSubmit={onSubmit} className="mt-8 grid gap-3 rounded-lg border border-stone-200 bg-white p-4 shadow-soft md:grid-cols-[1.2fr_1fr_1fr_1fr_auto]">
          <label className="grid gap-1">
            <span className="label">Type</span>
            <select className="field" value={filters.type} onChange={(event) => updateFilter("type", event.target.value)}>
              <option value="">Any boat</option>
              {boatTypes.map((type) => (
                <option key={type} value={type}>{type.replaceAll("_", " ")}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1">
            <span className="label">Guests</span>
            <input className="field" min="1" type="number" value={filters.capacity} onChange={(event) => updateFilter("capacity", event.target.value)} placeholder="4" />
          </label>
          <label className="grid gap-1">
            <span className="label">Min price</span>
            <input className="field" min="0" type="number" value={filters.minPrice} onChange={(event) => updateFilter("minPrice", event.target.value)} placeholder="$50" />
          </label>
          <label className="grid gap-1">
            <span className="label">Max price</span>
            <input className="field" min="0" type="number" value={filters.maxPrice} onChange={(event) => updateFilter("maxPrice", event.target.value)} placeholder="$300" />
          </label>
          <button type="submit" className="btn-primary self-end">
            <Search size={17} />
            Search
          </button>
        </form>

        <div className="mt-8 flex items-center justify-between gap-4">
          <div>
            <h2 className="section-title">Available Boats</h2>
            <p className="mt-1 text-sm text-stone-600">{boats.length} result{boats.length === 1 ? "" : "s"}</p>
          </div>
          <div className="hidden items-center gap-2 text-sm font-semibold text-stone-500 sm:flex">
            <SlidersHorizontal size={17} />
            Filters applied instantly on search
          </div>
        </div>

        {loading ? (
          <LoadingSpinner label="Loading boats" />
        ) : boats.length ? (
          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {boats.map((boat) => <BoatCard key={boat.id} boat={boat} />)}
          </div>
        ) : (
          <div className="mt-6 rounded-lg border border-dashed border-stone-300 bg-white p-10 text-center">
            <h3 className="text-lg font-bold text-stone-950">No boats match those filters</h3>
            <p className="mt-2 text-stone-600">Try widening the capacity or price range.</p>
          </div>
        )}
      </section>
    </main>
  );
}
