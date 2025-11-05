import express from "express";
import {
    createComment,
    getCommentsByThreadId,
    updateComment,
    deleteComment,
    getAuthorData
} from "../controllers/comments.controllers.mjs";
import { authenticateToken } from "../middlewares/auth.mjs";

const router = express.Router();

router.post("/", authenticateToken, createComment);

router.put("/:id", authenticateToken, updateComment);
router.delete("/:id", authenticateToken, deleteComment);
router.get("/:authorId", getAuthorData)
export default router;
