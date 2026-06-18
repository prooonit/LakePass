import { Router } from "express";
import {createMarinaController,getMarinaMembersController,getMyMarinasController,inviteMemberController,} from "../controllers/marina.controller.js";
import {getMarinaBookings, checkInBooking, checkOutBooking} from "../controllers/booking.controller.js";
import {authenticate,authorizeRoles,loadMarinaMembership,} from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/", createMarinaController);
router.get("/my", getMyMarinasController);


router.post("/:slug/invite",loadMarinaMembership("slug"),authorizeRoles("OWNER"),inviteMemberController,);

router.get("/:slug/members",loadMarinaMembership("slug"),getMarinaMembersController,);

router.get("/:slug/bookings",authenticate,loadMarinaMembership("slug"),authorizeRoles("OWNER", "MANAGER", "STAFF"),getMarinaBookings);


router.patch("/bookings/:bookingId/check-in",authenticate,checkInBooking);

router.patch("/bookings/:bookingId/check-out",authenticate,checkOutBooking);
export default router;
