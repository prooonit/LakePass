import express from "express";
import { authenticate } from "../middleware/auth.middleware.js";
import { createBooking, getMyBookings } from "../controllers/booking.controller.js";

const router= express.Router();


router.post("/book",authenticate,createBooking);
router.get("/my-bookings",authenticate,getMyBookings);

export default router;
