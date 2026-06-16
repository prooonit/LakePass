import { Router } from "express";
import {createMarinaController,getMarinaMembersController,getMyMarinasController,inviteMemberController,} from "../controllers/marina.controller.js";
import {getMarinaBookings, checkInBooking, checkOutBooking} from "../controllers/booking.controller.js";
import {authenticate,authorizeRoles,loadMarinaMembership,} from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/", createMarinaController);
router.get("/my", getMyMarinasController);


router.post("/:marinaId/invite",loadMarinaMembership(),authorizeRoles("OWNER"),inviteMemberController,);

router.get("/:marinaId/members",loadMarinaMembership(),getMarinaMembersController,);

router.get("/:slug/bookings",authenticate,loadMarinaMembership("slug"),authorizeRoles("OWNER", "MANAGER", "STAFF"),getMarinaBookings);


router.patch("/bookings/:bookingId/check-in",authenticate,checkInBooking);

router.patch("/bookings/:bookingId/check-out",authenticate,checkOutBooking);
export default router;
