import express from "express";

import {
  authenticate,
  loadMarinaMembership,
  authorizeRoles,
} from "../middleware/auth.middleware.js";

import {
  createBoat,
  getMarinaBoats,
  getBoatById,
  updateBoat,
  deactivateBoat,
} from "../controllers/boat.controller.js";

const router = express.Router();

router.post(
  "/marinas/:slug/boats",
  authenticate,
  loadMarinaMembership("slug"),
  authorizeRoles("OWNER", "MANAGER"),
  createBoat
);

router.get(
  "/marinas/:slug/boats",
  authenticate,
  loadMarinaMembership("slug"),
  authorizeRoles("OWNER", "MANAGER", "STAFF"),
  getMarinaBoats
);

router.get(
  "/marinas/:slug/boats/:boatId",
  authenticate,
  loadMarinaMembership("slug"),
  authorizeRoles("OWNER", "MANAGER", "STAFF"),
  getBoatById
);

router.put(
  "/marinas/:slug/boats/:boatId",
  authenticate,
  loadMarinaMembership("slug"),
  authorizeRoles("OWNER", "MANAGER"),
  updateBoat
);

router.delete(
  "/marinas/:slug/boats/:boatId",
  authenticate,
  loadMarinaMembership("slug"),
  authorizeRoles("OWNER"),
  deactivateBoat
);

export default router;