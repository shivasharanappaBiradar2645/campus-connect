import { db } from "../models/db.mjs";
import { comments } from "../models/schema.mjs";
import { eq } from "drizzle-orm";

export const createComment = async (req, res) => {
  try {
    const { threadId, parentId, content } = req.body;
    const authorId = req.user.id;

    const newComment = await db.insert(comments).values({
      threadId,
      authorId,
      parentId,
      content,
    }).returning();

    res.status(201).json({ message: "Comment created successfully", comment: newComment[0] });
  } catch (e) {
    console.error("Comment creation error:", e);
    res.status(500).json({ error: e});
  }
};

export const getCommentsByThreadId = async (req, res) => {
  try {
    const { threadId } = req.params;
    const threadComments = await db.select().from(comments).where(eq(comments.threadId, threadId));
    res.status(200).json(threadComments);
  } catch (e) {
    console.error("Get comments by thread id error:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { content } = req.body;
    const authorId = req.user.id;

    const comment = await db.select().from(comments).where(eq(comments.id, id));

    if (comment.length === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment[0].authorId !== authorId) {
      return res.status(403).json({ error: "You are not authorized to update this comment" });
    }

    const updatedComment = await db.update(comments).set({
      content,
      updatedAt: new Date(),
    }).where(eq(comments.id, id)).returning();

    res.status(200).json({ message: "Comment updated successfully", comment: updatedComment[0] });
  } catch (e) {
    console.error("Update comment error:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;
    const authorId = req.user.id;

    const comment = await db.select().from(comments).where(eq(comments.id, id));

    if (comment.length === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }

    if (comment[0].authorId !== authorId) {
      return res.status(403).json({ error: "You are not authorized to delete this comment" });
    }

    await db.delete(comments).where(eq(comments.id, id));

    res.status(200).json({ message: "Comment deleted successfully" });
  } catch (e) {
    console.error("Delete comment error:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};
