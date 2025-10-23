import express from "express";
import {register,login,getUserProfile} from "../controllers/auth.controllers.mjs"
import { authenticateToken } from "../middlewares/auth.mjs";

const router = express.Router();

router.post("/signup",register);
router.post("/login",login);
router.get("/profile", authenticateToken, getUserProfile);

export default router;