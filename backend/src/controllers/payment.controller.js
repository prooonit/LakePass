import * as paymentService from "../services/payment.service.js";

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