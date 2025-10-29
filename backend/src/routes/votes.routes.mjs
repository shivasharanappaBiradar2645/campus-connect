import express from "express";
import { createVote, deleteVote } from "../controllers/votes.controllers.mjs";
import { authenticateToken } from "../middlewares/auth.mjs";

const router = express.Router();

router.post("/", authenticateToken, createVote);
router.delete("/:id", authenticateToken, deleteVote);

export default router;
