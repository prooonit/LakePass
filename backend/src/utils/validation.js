import { ApiError } from "./api-error.js";

export const requireString = (value, fieldName) => {
  if (typeof value !== "string" || !value.trim()) {
    throw new ApiError(400, `${fieldName} is required`);
  }

  return value.trim();
};

export const normalizeEmail = (value) => {
  const email = requireString(value, "email").toLowerCase();
  const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  if (!isValidEmail) {
    throw new ApiError(400, "email must be valid");
  }

  return email;
};

export const requireEnumValue = (value, allowedValues, fieldName) => {
  if (!allowedValues.includes(value)) {
    throw new ApiError(400, `${fieldName} must be one of: ${allowedValues.join(", ")}`);
  }

  return value;
};
