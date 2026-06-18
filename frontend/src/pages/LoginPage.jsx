import { Sailboat } from "lucide-react";
import { useEffect, useRef } from "react";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/AuthContext";

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
console.log("Google Client ID:", googleClientId);

export default function LoginPage() {
  const buttonRef = useRef(null);
  const { isAuthenticated, loginGoogle, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const redirectTo = location.state?.from?.pathname || "/";

  useEffect(() => {
    if (!googleClientId || !buttonRef.current || isAuthenticated) {
      return;
    }

    const init = () => {
      if (!window.google?.accounts?.id || !buttonRef.current) {
        return false;
      }

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: async (response) => {
          try {
            await loginGoogle(response.credential);
            navigate(redirectTo, { replace: true });
          } catch (error) {
            toast.error(error.message);
          }
        },
      });

      window.google.accounts.id.renderButton(buttonRef.current, {
        theme: "outline",
        size: "large",
        width: Math.min(360, buttonRef.current.offsetWidth || 360),
        text: "signin_with",
        shape: "rectangular",
      });

      return true;
    };

    if (init()) {
      return undefined;
    }

    const timer = window.setInterval(() => {
      if (init()) {
        window.clearInterval(timer);
      }
    }, 150);

    return () => window.clearInterval(timer);
  }, [isAuthenticated, loginGoogle, navigate, redirectTo]);

  if (isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  return (
    <main className="grid min-h-screen lg:grid-cols-[1fr_460px]">
      <section className="relative flex min-h-[48vh] items-end bg-stone-900 px-6 py-10 text-white lg:min-h-screen lg:px-14 lg:py-16">
        <img
          src="https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1800&q=80"
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/35 to-stone-950/10" />
        <div className="relative max-w-2xl">
          <div className="mb-5 inline-grid h-12 w-12 place-items-center rounded-lg bg-rose-600">
            <Sailboat size={24} />
          </div>
          <h1 className="text-5xl font-black tracking-normal sm:text-6xl">Lake Pass</h1>
          <p className="mt-4 max-w-xl text-lg leading-8 text-white/88">
            Discover bookable boats, manage marina operations, and keep every dockside handoff moving cleanly.
          </p>
        </div>
      </section>

      <section className="flex items-center bg-white px-6 py-10 sm:px-10">
        <div className="w-full">
          <h2 className="text-3xl font-black text-stone-950">Sign in</h2>
          <p className="mt-2 text-stone-600">Use your Google account to continue to Lake Pass.</p>
          <div className="mt-8 min-h-11 w-full" ref={buttonRef} />
          {!googleClientId && (
            <div className="mt-5 rounded-lg border border-red-200 bg-red-50 p-4 text-sm font-medium text-red-700">
              Add VITE_GOOGLE_CLIENT_ID to frontend/.env.
            </div>
          )}
          {loading && <p className="mt-4 text-sm font-medium text-stone-600">Signing you in...</p>}
        </div>
      </section>
    </main>
  );
}
