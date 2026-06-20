import { Link } from "react-router-dom";
import { MapPin, Users } from "lucide-react";
import StatusBadge from "./StatusBadge";

const images = {
  YACHT: "https://images.unsplash.com/photo-1569263979104-865ab7cd8d13?auto=format&fit=crop&w=900&q=80",
  PONTOON: "https://images.unsplash.com/photo-1502784444187-359ac186c5bb?auto=format&fit=crop&w=900&q=80",
  SPEED_BOAT: "https://images.unsplash.com/photo-1528154291023-a6525fabe5b4?auto=format&fit=crop&w=900&q=80",
  FISHING_BOAT: "https://images.unsplash.com/photo-1510407857691-180bc78628cb?auto=format&fit=crop&w=900&q=80",
  JET_SKI: "https://images.unsplash.com/photo-1567899378494-47b22a2ae96a?auto=format&fit=crop&w=900&q=80",
  OTHER: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=900&q=80",
};

export default function BoatCard({ boat }) {
  return (
    <Link to={`/boats/${boat.id}`} className="group block overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-stone-200 transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="aspect-[4/3] overflow-hidden bg-stone-200">
        <img
          src={images[boat.type] || images.OTHER}
          alt=""
          className="h-full w-full object-cover transition duration-300 group-hover:scale-105"
        />
      </div>
      <div className="grid gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h3 className="line-clamp-1 font-bold text-stone-950">{boat.name}</h3>
            <p className="mt-1 flex items-center gap-1 text-sm text-stone-600">
              <MapPin size={14} />
              {boat.marina?.name || "Lake Pass marina"}
            </p>
          </div>
          {boat.status && <StatusBadge status={boat.status} />}
        </div>
        <div className="flex items-center justify-between text-sm text-stone-600">
          <span className="flex items-center gap-1">
            <Users size={15} />
            {boat.capacity} guests
          </span>
          <span>
            <strong className="text-stone-950">${Number(boat.hourlyRate).toFixed(0)}</strong> / hour
          </span>
        </div>
      </div>
    </Link>
  );
}
