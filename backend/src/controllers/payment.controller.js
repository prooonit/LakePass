import Stripe from "stripe";
import prisma from "../config/prisma.js";
import * as paymentService from "../services/payment.service.js";




const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const stripeWebhook = async (req, res) => {
  const signature = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error(err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object;

    const bookingId = session.metadata.bookingId;

    await prisma.booking.update({
      where: {
        id: bookingId,
      },
      data: {
        status: "CONFIRMED",
        paymentStatus: "PAID",
        stripePaymentIntentId: session.payment_intent,
      },
    });

    console.log("Booking confirmed:", bookingId);
  }

  res.json({ received: true });
};

export const createCheckoutController = async (
  req,
  res,
  next
) => {
  try {
    const session =
      await paymentService.createCheckoutSession(
        req.user.id,
        req.body.bookingId
    
      );

    res.status(200).json({
      success: true,
      url: session.url,
    });
  } catch (error) {
    next(error);
  }
};