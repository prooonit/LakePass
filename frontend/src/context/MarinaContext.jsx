import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { toast } from "react-toastify";
import * as marinaApi from "../api/marinas";

const MarinaContext = createContext(null);

export function MarinaProvider({ children }) {
  const [marinas, setMarinas] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadMarinas = useCallback(async () => {
    setLoading(true);

    try {
      const data = await marinaApi.getMyMarinas();
      setMarinas(Array.isArray(data) ? data : []);
      return data;
    } catch (error) {
      toast.error(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

  const createMarina = useCallback(
    async (payload) => {
      const marina = await marinaApi.createMarina(payload);
      toast.success("Marina created");
      await loadMarinas();
      return marina;
    },
    [loadMarinas]
  );

  const getMarinaBySlug = useCallback(
    (slug) => marinas.find((marina) => marina.slug === slug),
    [marinas]
  );

  const value = useMemo(
    () => ({
      marinas,
      loading,
      loadMarinas,
      createMarina,
      getMarinaBySlug,
    }),
    [marinas, loading, loadMarinas, createMarina, getMarinaBySlug]
  );

  return <MarinaContext.Provider value={value}>{children}</MarinaContext.Provider>;
}

export const useMarinas = () => {
  const value = useContext(MarinaContext);

  if (!value) {
    throw new Error("useMarinas must be used inside MarinaProvider");
  }

  return value;
};
