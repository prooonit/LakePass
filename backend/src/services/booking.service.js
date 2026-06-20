import { Prisma } from "@prisma/client";
import prisma from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";

const BLOCKING_BOOKING_STATUSES = [
  "CONFIRMED",
  "CHECKED_IN",
  "CHECKED_OUT",
];

const parseBookingTimeRange = (startTime, endTime) => {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new ApiError(
      400,
      "Invalid booking time range"
    );
  }

  if (end <= start) {
    throw new ApiError(
      400,
      "Invalid booking time range"
    );
  }

  return {
    start,
    end,
  };
};

const ensureBoatExists = async (boatId, client = prisma) => {
  if (!boatId) {
    throw new ApiError(
      400,
      "Boat is required"
    );
  }

  const boat =
    await client.boat.findUnique({
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

  return boat;
};

const findOverlappingBooking = async (
  boatId,
  startTime,
  endTime,
  client = prisma
) => {
  return client.booking.findFirst({
    where: {
      boatId,

      status: {
        in: BLOCKING_BOOKING_STATUSES,
      },

      startTime: {
        lt: endTime,
      },

      endTime: {
        gt: startTime,
      },
    },
  });
};

export const isBoatAvailable = async (
  boatId,
  startTime,
  endTime,
  client = prisma
) => {
  await ensureBoatExists(boatId, client);

  const { start, end } =
    parseBookingTimeRange(
      startTime,
      endTime
    );

  const overlappingBooking =
    await findOverlappingBooking(
      boatId,
      start,
      end,
      client
    );

  return !overlappingBooking;
};

export const getBoatAvailability = async (
  boatId,
  query
) => {
  const { startTime, endTime } = query;

  const available =
    await isBoatAvailable(
      boatId,
      startTime,
      endTime
    );

  return {
    available,
  };
};

export const createBooking = async (userId, payload) => {
  const {
    boatId,
    startTime,
    endTime,
  } = payload;

  return prisma.$transaction(
    async (tx) => {
      const boat =
        await ensureBoatExists(
          boatId,
          tx
        );

      const { start, end } =
        parseBookingTimeRange(
          startTime,
          endTime
        );

      const overlappingBooking =
        await findOverlappingBooking(
          boatId,
          start,
          end,
          tx
        );

      if (overlappingBooking) {
        throw new ApiError(
          400,
          "Boat is not available for selected time"
        );
      }

      const hours =
        (end - start) /
        (1000 * 60 * 60);

      const totalPrice =
        Number(boat.hourlyRate) * hours;

      return tx.booking.create({
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
    },
    {
      isolationLevel:
        Prisma.TransactionIsolationLevel.Serializable,
    }
  );
};

export const confirmPaidBooking = async (
  bookingId,
  stripePaymentIntentId
) => {
  return prisma.$transaction(
    async (tx) => {
      const booking =
        await tx.booking.findUnique({
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
        booking.status === "CONFIRMED" &&
        booking.paymentStatus === "PAID"
      ) {
        return booking;
      }

      const overlappingBooking =
        await tx.booking.findFirst({
          where: {
            id: {
              not: booking.id,
            },

            boatId: booking.boatId,

            status: {
              in: BLOCKING_BOOKING_STATUSES,
            },

            startTime: {
              lt: booking.endTime,
            },

            endTime: {
              gt: booking.startTime,
            },
          },
        });

      if (overlappingBooking) {
        throw new ApiError(
          400,
          "Boat is not available for selected time"
        );
      }

      return tx.booking.update({
        where: {
          id: booking.id,
        },

        data: {
          status: "CONFIRMED",
          paymentStatus: "PAID",
          stripePaymentIntentId,
        },
      });
    },
    {
      isolationLevel:
        Prisma.TransactionIsolationLevel.Serializable,
    }
  );
};

export const getMyBookings = async (userId) => {
  return prisma.booking.findMany({
    where: {
      userId,
    },

    include: {
      boat: {
        include: {
          marina: true,
        },
      },
    },

    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getMarinaBookings = async (
  marinaId,
  status
) => {
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

  if (booking.status !== "CONFIRMED") {
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

  if (booking.status !== "CHECKED_IN") {
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
