import api, { unwrap } from "./client";

export const getMyMarinas = async () => {
  const response = await api.get("/marinas/my");
  return unwrap(response);
};

export const createMarina = async (payload) => {
  const response = await api.post("/marinas", payload);
  return unwrap(response);
};

export const inviteMarinaMember = async (slug, payload) => {
  const response = await api.post(`/marinas/${slug}/invite`, payload);
  return unwrap(response);
};
