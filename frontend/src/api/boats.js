import api, { unwrap } from "./client";

export const searchBoats = async (params = {}) => {
  const response = await api.get("/marinas/boats/search", { params });
  return unwrap(response);
};

export const getBoatById = async (slug, boatId) => {
  const response = await api.get(`/marinas/${slug}/boats/${boatId}`);
  return unwrap(response);
};

export const getMarinaBoats = async (slug) => {
  const response = await api.get(`/marinas/${slug}/boats`);
  return unwrap(response);
};

export const createBoat = async (slug, payload) => {
  const response = await api.post(`/marinas/${slug}/boats`, payload);
  return unwrap(response);
};

export const updateBoat = async (slug, boatId, payload) => {
  const response = await api.put(`/marinas/${slug}/boats/${boatId}`, payload);
  return unwrap(response);
};
