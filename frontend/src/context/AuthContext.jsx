import { createContext, useContext, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { loginWithGoogle } from "../api/auth";
import { SESSION_KEY, getStoredSession } from "../api/client";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(() => getStoredSession());
  const [loading, setLoading] = useState(false);

  const loginGoogle = async (credential) => {
    setLoading(true);

    try {
      const data = await loginWithGoogle(credential);
      localStorage.setItem(SESSION_KEY, JSON.stringify(data));
      setSession(data);
      toast.success("Signed in successfully");
      return data;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem(SESSION_KEY);
    setSession(null);
    window.google?.accounts?.id?.disableAutoSelect();
    toast.info("Signed out");
  };

  const value = useMemo(
    () => ({
      user: session?.user ?? null,
      token: session?.token ?? null,
      isAuthenticated: Boolean(session?.token),
      loading,
      loginGoogle,
      logout,
    }),
    [session, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return value;
};
