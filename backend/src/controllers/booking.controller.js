import * as bookingService from "../services/booking.service.js";

export const createBooking = async (req,res,next) => {
  try {
    const booking =
      await bookingService.createBooking(
        req.user.id,
        req.body
      );

    res.status(201).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const getMyBookings = async (req,res,next) => {
  try {
    const bookings =
      await bookingService.getMyBookings(
        req.user.id
      );

    res.json({
      success: true,
      data: bookings,
    });
  } catch (error) {
    next(error);
  }
};

export const getBoatAvailability = async (req,res,next) => {
  try {
    const availability =
      await bookingService.getBoatAvailability(
        req.params.boatId,
        req.query
      );

    res.json(availability);
  } catch (error) {
    next(error);
  }
};


export const getMarinaBookings = async (req,res,next) => {
  try {
    const bookings =
      await bookingService.getMarinaBookings(
        req.marina.id,
        req.query.status
      );
     res.json({
      success: true,
      data: bookings,
      });
  } catch (error) {
    next(error);
  }
};

export const checkInBooking = async (req,res,next
) => {
  try {
    const booking =
      await bookingService.checkInBooking(
        req.user.id,
        req.params.bookingId
      );

    res.json({
      success: true,
      message: "Booking checked in",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

export const checkOutBooking = async (req,res,next) => {
  try {
    const booking =
      await bookingService.checkOutBooking(
        req.user.id,
        req.params.bookingId
      );

    res.json({
      success: true,
      message: "Booking checked out",
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};
