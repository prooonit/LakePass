import { useEffect, useRef, useState } from "react";

const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";
const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

function App() {
  const googleButtonRef = useRef(null);
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("");
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem("lakepass_session");
    return saved ? JSON.parse(saved) : null;
  });

  useEffect(() => {
    if (!googleClientId || !googleButtonRef.current) {
      return;
    }

    const initializeGoogle = () => {
      if (!window.google?.accounts?.id || !googleButtonRef.current) {
        return;
      }

      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleGoogleCredential,
      });

      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        width: 320,
        text: "signin_with",
        shape: "rectangular",
      });
    };

    if (window.google?.accounts?.id) {
      initializeGoogle();
      return;
    }

    const timer = window.setInterval(() => {
      if (window.google?.accounts?.id) {
        window.clearInterval(timer);
        initializeGoogle();
      }
    }, 100);

    return () => window.clearInterval(timer);
  }, []);

  const handleGoogleCredential = async (response) => {
    setStatus("loading");
    setMessage("");

    try {
      const result = await fetch(`${apiUrl}/api/auth/google`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ idToken: response.credential }),
      });

      const payload = await result.json();

      if (!result.ok || !payload.success) {
        throw new Error(payload.message || "Google login failed");
      }

      localStorage.setItem("lakepass_session", JSON.stringify(payload.data));
      setSession(payload.data);
      setStatus("success");
      setMessage("Signed in successfully.");
    } catch (error) {
      setStatus("error");
      setMessage(error.message);
    }
  };

  const logout = () => {
    localStorage.removeItem("lakepass_session");
    setSession(null);
    setStatus("idle");
    setMessage("");
    window.google?.accounts?.id?.disableAutoSelect();
  };

  return (
    <main className="login-shell">
      <section className="brand-panel" aria-label="LakePass welcome">
        <div className="brand-mark">LP</div>
        <h1>LakePass</h1>
        <p>Simple marina access, member identity, and account sign-in.</p>
      </section>

      <section className="login-panel" aria-label="Login form">
        {session ? (
          <div className="account-card">
            {session.user.avatarUrl ? (
              <img src={session.user.avatarUrl} alt="" className="avatar" />
            ) : (
              <div className="avatar placeholder">
                {session.user.name?.slice(0, 1) || "U"}
              </div>
            )}
            <div>
              <h2>{session.user.name}</h2>
              <p>{session.user.email}</p>
            </div>
            <button type="button" className="primary-button" onClick={logout}>
              Sign out
            </button>
          </div>
        ) : (
          <>
            <div className="login-heading">
              <h2>Sign in</h2>
              <p>Use your Google account to continue.</p>
            </div>

            {!googleClientId ? (
              <div className="notice error">
                Add VITE_GOOGLE_CLIENT_ID to frontend/.env.
              </div>
            ) : (
              <div className="google-button" ref={googleButtonRef} />
            )}

            {status === "loading" && <div className="notice">Signing you in...</div>}
            {message && <div className={`notice ${status}`}>{message}</div>}
          </>
        )}
      </section>
    </main>
  );
}

export default App;
