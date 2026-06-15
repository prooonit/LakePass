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

export const loadMarinaMembership = (paramName = "slug") => async (req, _res, next) => {
  try {
    const slug = req.params[paramName];

    if (!slug) {
      throw new ApiError(400, "Marina slug is required");
    }

    const marina = await prisma.marina.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
        name: true,
        slug: true,
      },
    });

    if (!marina) {
      throw new ApiError(404, "Marina not found");
    }

    const membership = await prisma.marinaMember.findUnique({
      where: {
        marinaId_userId: {
          marinaId: marina.id,
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
      id: marina.id,
      slug: marina.slug,
      name: marina.name,
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
