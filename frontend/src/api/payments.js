import api from "./client";

export const createCheckoutSession = async (bookingId) => {
  const response = await api.post("/payment/checkout-session", { bookingId });
  return response.data?.url;
};
