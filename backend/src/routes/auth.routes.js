import { Router } from "express";
import { googleLogin } from "../controllers/auth.controller.js";

const router = Router();

router.post("/google", googleLogin);
router.post("/google/callback", googleLogin);

export default router;
