import stripe from "../config/stripe.js";
import prisma from "../config/prisma.js";
import { ApiError } from "../utils/api-error.js";


export const createCheckoutSession =
  async (userId, bookingId) => {

    const booking =
      await prisma.booking.findUnique({
        where: {
          id: bookingId,
        },

        include: {
          boat: true,
          user: true,
        },
      });

    if (!booking) {
      throw new ApiError(
        404,
        "Booking not found"
      );
    }

    if (booking.userId !== userId) {
      throw new ApiError(
        403,
        "Not your booking"
      );

    }

    const frontendUrl =
      process.env.FRONTEND_URL ||
      "http://localhost:5173";

   const session =
  await stripe.checkout.sessions.create({
    mode: "payment",

    customer_email: booking.user.email,

    line_items: [
      {
        price_data: {
          currency: "usd",

          product_data: {
            name: booking.boat.name,
          },

          unit_amount:
            Math.round(
              Number(booking.totalPrice) * 100
            ),
        },

        quantity: 1,
      },
    ],

    metadata: {
      bookingId: booking.id,
    },

    success_url:
      `${frontendUrl}/payment/success`,

    cancel_url:
      `${frontendUrl}/payment/cancel`,
  });

return session;
  };
