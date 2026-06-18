import api, { unwrap } from "./client";

export const createBooking = async (payload) => {
  const response = await api.post("/booking/book", payload);
  return unwrap(response);
};

export const getMyBookings = async () => {
  const response = await api.get("/booking/my-bookings");
  return unwrap(response);
};

export const getMarinaBookings = async (slug, status) => {
  const response = await api.get(`/marinas/${slug}/bookings`, {
    params: status ? { status } : {},
  });
  return unwrap(response);
};

export const checkInBooking = async (bookingId) => {
  const response = await api.patch(`/marinas/bookings/${bookingId}/check-in`);
  return unwrap(response);
};

export const checkOutBooking = async (bookingId) => {
  const response = await api.patch(`/marinas/bookings/${bookingId}/check-out`);
  return unwrap(response);
};
