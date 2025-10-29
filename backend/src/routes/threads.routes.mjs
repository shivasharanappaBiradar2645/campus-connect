import express from "express";
import { createThread, getThreads, getThreadById, updateThread, deleteThread } from "../controllers/threads.controllers.mjs";
import { authenticateToken } from "../middlewares/auth.mjs";
import { getCommentsByThreadId } from "../controllers/comments.controllers.mjs";

const router = express.Router();

router.post("/", authenticateToken, createThread);
router.get("/", getThreads);
router.get("/:id", getThreadById);
router.get("/:threadId/comments",getCommentsByThreadId);
router.put("/:id", authenticateToken, updateThread);
router.delete("/:id", authenticateToken, deleteThread);

export default router;
