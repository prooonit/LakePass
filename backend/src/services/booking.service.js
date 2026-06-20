import prisma from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";

export const createBooking = async (userId,payload) => {
  const { boatId, startTime, endTime,} = payload;

  const boat =
    await prisma.boat.findUnique({
      where: {
        id: boatId,
      },
    });

  if (!boat) {
    throw new ApiError(
      404,
      "Boat not found"
    );
  }

  const start = new Date(startTime);
  const end = new Date(endTime);

  if (end <= start) {
    throw new ApiError(
      400,
      "Invalid booking time range"
    );
  }

  const conflict =
    await prisma.booking.findFirst({
      where: {
        boatId,

        status: {
          in: [
            "PENDING",
            "CONFIRMED",
            "CHECKED_IN",
          ],
        },

        startTime: {
          lt: end,
        },

        endTime: {
          gt: start,
        },
      },
    });

  if (conflict) {
    throw new ApiError(
      409,
      "Boat is unavailable"
    );
  }

  const hours =
    (end - start) /
    (1000 * 60 * 60);

  const totalPrice =
    Number(boat.hourlyRate) * hours;

  return prisma.booking.create({
    data: {
      userId,
      boatId,

      startTime: start,
      endTime: end,

      totalPrice,

      status: "PENDING",
    },

    include: {
      boat: true,
    },
  });
};


export const getMyBookings = async (userId) => {
  return prisma.booking.findMany({
    where: {
      userId,
    },
    include: {boat: {include: {marina: true,},},
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};


export const getMarinaBookings = async (marinaId,status) => {
  return prisma.booking.findMany({
    where: {
      boat: {
        marinaId,
      },
    ...(status
        ? {
            status,
          }
        : {}),
    },

    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },

      boat: {
        select: {
          id: true,
          name: true,
          boatCode: true,
          type: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};


export const checkInBooking = async (
  userId,
  bookingId
) => {
  const booking =
    await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

  if (!booking) {
    throw new ApiError(
      404,
      "Booking not found"
    );
  }

  if (
    booking.status !== "CONFIRMED"
  ) {
    throw new ApiError(
      400,
      "Only confirmed bookings can be checked in"
    );
  }

  return prisma.booking.update({
    where: {
      id: bookingId,
    },

    data: {
      status: "CHECKED_IN",
    },
  });
};

export const checkOutBooking = async (
  userId,
  bookingId
) => {
  const booking =
    await prisma.booking.findUnique({
      where: {
        id: bookingId,
      },
    });

  if (!booking) {
    throw new ApiError(
      404,
      "Booking not found"
    );
  }

  if (
    booking.status !== "CHECKED_IN"
  ) {
    throw new ApiError(
      400,
      "Only checked-in bookings can be checked out"
    );
  }

  return prisma.booking.update({
    where: {
      id: bookingId,
    },

    data: {
      status: "CHECKED_OUT",
    },
  });
};