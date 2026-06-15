import { Router } from "express";
import {createMarinaController,getMarinaMembersController,getMyMarinasController,inviteMemberController,} from "../controllers/marina.controller.js";
import {authenticate,authorizeRoles,loadMarinaMembership,} from "../middleware/auth.middleware.js";

const router = Router();

router.use(authenticate);

router.post("/", createMarinaController);
router.get("/my", getMyMarinasController);


router.post(
  "/:marinaId/invite",
  loadMarinaMembership(),
  authorizeRoles("OWNER"),
  inviteMemberController,
);

router.get(
  "/:marinaId/members",
  loadMarinaMembership(),
  getMarinaMembersController,
);

export default router;
