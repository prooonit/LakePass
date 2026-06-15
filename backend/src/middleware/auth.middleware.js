import prisma from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";
import { verifyToken } from "../utils/jwt.js";

export const authenticate = async (req, _res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith("Bearer ")) {
      throw new ApiError(401, "Authorization token is required");
    }

    const token = authHeader.slice("Bearer ".length);
    const payload = verifyToken(token);

    if (!payload?.userId) {
      throw new ApiError(401, "Invalid authorization token");
    }

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        name: true,
      },
    });

    if (!user) {
      throw new ApiError(401, "Authenticated user no longer exists");
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
      next(new ApiError(401, "Invalid authorization token"));
      return;
    }

    next(error);
  }
};

export const loadMarinaMembership = (paramName = "marinaId") => async (req, _res, next) => {
  try {
    const marinaId = req.params[paramName];

    if (!marinaId) {
      throw new ApiError(400, "marinaId is required");
    }

    const membership = await prisma.marinaMember.findUnique({
      where: {
        marinaId_userId: {
          marinaId,
          userId: req.user.id,
        },
      },
      select: {
        id: true,
        marinaId: true,
        role: true,
      },
    });

    if (!membership) {
      throw new ApiError(403, "You do not belong to this marina");
    }

    req.marina = {
      id: membership.marinaId,
      role: membership.role,
      membershipId: membership.id,
    };
    next();
  } catch (error) {
    next(error);
  }
};

export const authorizeRoles = (...allowedRoles) => (req, _res, next) => {
  if (!req.marina?.role) {
    next(new ApiError(500, "Marina role was not loaded"));
    return;
  }

  if (!allowedRoles.includes(req.marina.role)) {
    next(new ApiError(403, "You do not have permission to perform this action"));
    return;
  }

  next();
};
