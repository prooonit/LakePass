import api, { unwrap } from "./client";

export const loginWithGoogle = async (idToken) => {
  const response = await api.post("/auth/google/callback", { idToken });
  return unwrap(response);
};
