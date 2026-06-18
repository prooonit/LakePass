import { Anchor, CalendarDays, Home, LogOut, Menu, Sailboat } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/", label: "Explore", icon: Home },
  { to: "/my-bookings", label: "Bookings", icon: CalendarDays },
  { to: "/marinas", label: "Marinas", icon: Anchor },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 border-b border-stone-200 bg-white/95 backdrop-blur">
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 text-lg font-black text-rose-600">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-rose-600 text-white">
            <Sailboat size={20} />
          </span>
          Lake Pass
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                `flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition ${
                  isActive ? "bg-stone-100 text-stone-950" : "text-stone-600 hover:bg-stone-50"
                }`
              }
            >
              <item.icon size={16} />
              {item.label}
            </NavLink>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <div className="text-right">
            <p className="text-sm font-bold text-stone-950">{user?.name}</p>
            <p className="text-xs text-stone-500">{user?.email}</p>
          </div>
          {user?.avatarUrl ? (
            <img src={user.avatarUrl} alt="" className="h-9 w-9 rounded-full object-cover" />
          ) : (
            <div className="grid h-9 w-9 place-items-center rounded-full bg-stone-200 text-sm font-bold">
              {user?.name?.slice(0, 1) || "U"}
            </div>
          )}
          <button type="button" onClick={logout} className="btn-secondary px-3" aria-label="Sign out">
            <LogOut size={16} />
          </button>
        </div>

        <button type="button" onClick={() => setOpen((value) => !value)} className="btn-secondary px-3 md:hidden">
          <Menu size={18} />
        </button>
      </nav>

      {open && (
        <div className="border-t border-stone-200 bg-white px-4 py-3 md:hidden">
          <div className="grid gap-2">
            {navItems.map((item) => (
              <NavLink key={item.to} to={item.to} onClick={() => setOpen(false)} className="btn-secondary justify-start">
                <item.icon size={16} />
                {item.label}
              </NavLink>
            ))}
            <button type="button" onClick={logout} className="btn-secondary justify-start">
              <LogOut size={16} />
              Sign out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
