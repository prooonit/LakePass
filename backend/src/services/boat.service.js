import prisma from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";

export const createBoat = async (marinaId, payload) => {
  const boat = await prisma.boat.create({
    data: {
      marinaId,

      name: payload.name,
      boatCode: payload.boatCode,
      description: payload.description,
      type: payload.type,
      capacity: payload.capacity,
      hourlyRate: payload.hourlyRate,
    },
  });

  return boat;
};

export const getMarinaBoats = async (marinaId) => {
  return prisma.boat.findMany({
    where: {
      marinaId,
      status: {
        not: "INACTIVE",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getBoatById = async (
  boatId,
  marinaId
) => {
  const boat = await prisma.boat.findFirst({
    where: {
      id: boatId,
      marinaId,
    },
  });

  if (!boat) {
    throw new ApiError(404, "Boat not found");
  }

  return boat;
};

export const updateBoat = async (
  boatId,
  marinaId,
  payload
) => {
  const existingBoat = await prisma.boat.findFirst({
    where: {
      id: boatId,
      marinaId,
    },
  });

  if (!existingBoat) {
    throw new ApiError(404, "Boat not found");
  }

  return prisma.boat.update({
    where: {
      id: boatId,
    },
    data: {
      name: payload.name,
      description: payload.description,
      type: payload.type,
      capacity: payload.capacity,
      hourlyRate: payload.hourlyRate,
      status: payload.status,
    },
  });
};

export const deactivateBoat = async (
  boatId,
  marinaId
) => {
  const existingBoat = await prisma.boat.findFirst({
    where: {
      id: boatId,
      marinaId,
    },
  });

  if (!existingBoat) {
    throw new ApiError(404, "Boat not found");
  }

  return prisma.boat.update({
    where: {
      id: boatId,
    },
    data: {
      status: "INACTIVE",
    },
  });
};

export const searchBoats = async (query) => {
  const {
    type,
    capacity,
    minPrice,
    maxPrice,
  } = query;

  return prisma.boat.findMany({
    where: {
      status: "ACTIVE",

      ...(type && {
        type,
      }),

      ...(capacity && {
        capacity: {
          gte: Number(capacity),
        },
      }),

      ...(minPrice || maxPrice
        ? {
            hourlyRate: {
              ...(minPrice && {
                gte: Number(minPrice),
              }),
              ...(maxPrice && {
                lte: Number(maxPrice),
              }),
            },
          }
        : {}),
    },

    include: {
      marina: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  });
};