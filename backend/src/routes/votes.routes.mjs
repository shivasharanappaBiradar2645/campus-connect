import express from "express";
import {countVote, createVote, deleteVote} from "../controllers/votes.controllers.mjs";
import { authenticateToken } from "../middlewares/auth.mjs";

const router = express.Router();

router.post("/", authenticateToken, createVote);
router.delete("/:id", authenticateToken, deleteVote);
router.get("/:id",countVote);
// router.get("/:authorId", getVotes);

export default router;
