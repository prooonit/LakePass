import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import {
  createBooking,
  getBoatAvailability,
  getMyBookings,
} from "../controllers/booking.controller.js";

const router= express.Router();


router.get("/boats/:boatId/availability",authenticate,getBoatAvailability);
router.post("/booking/book",authenticate,createBooking);
router.get("/booking/my-bookings",authenticate,getMyBookings);

export default router;
