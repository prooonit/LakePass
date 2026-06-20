import express from "express";

import {authenticate,loadMarinaMembership,authorizeRoles,} from "../middleware/auth.middleware.js";

import {createBoat,getMarinaBoats,getBoatById,updateBoat,deactivateBoat,searchBoats,getAllBoats, getBoatDetails} from "../controllers/boat.controller.js";

const router = express.Router();

router.post("/:slug/boats",authenticate,loadMarinaMembership("slug"),authorizeRoles("OWNER", "MANAGER"),createBoat);

router.get("/:slug/boats",authenticate,loadMarinaMembership("slug"),getMarinaBoats);

router.get("/:slug/boats/:boatId",authenticate,loadMarinaMembership("slug"),getBoatById);

router.put("/:slug/boats/:boatId",authenticate,loadMarinaMembership("slug"),authorizeRoles("OWNER", "MANAGER"),updateBoat);

router.delete("/:slug/boats/:boatId",authenticate,loadMarinaMembership("slug"),authorizeRoles("OWNER"),deactivateBoat);

/**
 * Customer side routes are here:
 */
router.get("/boats", authenticate, getAllBoats);

router.get("/boats/:boatId", authenticate, getBoatDetails);
/**
 * Searching routes are here:
 */

router.get("/boats/search", authenticate, searchBoats);

export default router;