import { Link } from "react-router-dom";
import { Anchor, ChevronRight } from "lucide-react";
import RoleBadge from "./RoleBadge";

export default function MarinaCard({ marina }) {
  return (
    <Link to={`/marinas/${marina.slug}`} className="flex items-center justify-between rounded-lg border border-stone-200 bg-white p-5 shadow-sm transition hover:border-stone-300 hover:shadow-soft">
      <div className="flex min-w-0 items-center gap-4">
        <div className="grid h-12 w-12 shrink-0 place-items-center rounded-lg bg-cyan-700 text-white">
          <Anchor size={22} />
        </div>
        <div className="min-w-0">
          <h3 className="truncate font-bold text-stone-950">{marina.name}</h3>
          <p className="text-sm text-stone-500">/{marina.slug}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <RoleBadge role={marina.role} />
        <ChevronRight size={18} className="text-stone-400" />
      </div>
    </Link>
  );
}
