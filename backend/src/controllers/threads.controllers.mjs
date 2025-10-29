
import { db } from "../models/db.mjs";
import { threads } from "../models/schema.mjs";
import { eq } from "drizzle-orm";

export const createThread = async (req, res) => {
  try {
    const { title, content, categoryId, departmentId, visibility } = req.body;
    const authorId = req.user.id;

    const newThread = await db.insert(threads).values({
      title,
      content,
      authorId,
      categoryId,
      departmentId,
      visibility,
    }).returning();

    res.status(201).json({ message: "Thread created successfully", thread: newThread[0] });
  } catch (e) {
    console.error("Thread creation error:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getThreads = async (req, res) => {
  try {
    const allThreads = await db.select().from(threads);
    res.status(200).json(allThreads);
  } catch (e) {
    console.error("Get threads error:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getThreadById = async (req, res) => {
  try {
    const { id } = req.params;
    const thread = await db.select().from(threads).where(eq(threads.id, id));

    if (thread.length === 0) {
      return res.status(404).json({ error: "Thread not found" });
    }

    res.status(200).json(thread[0]);
  } catch (e) {
    console.error("Get thread by id error:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateThread = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content, categoryId, departmentId, visibility } = req.body;
    const authorId = req.user.id;

    const thread = await db.select().from(threads).where(eq(threads.id, id));

    if (thread.length === 0) {
      return res.status(404).json({ error: "Thread not found" });
    }

    if (thread[0].authorId !== authorId) {
      return res.status(403).json({ error: "You are not authorized to update this thread" });
    }

    const updatedThread = await db.update(threads).set({
      title,
      content,
      categoryId,
      departmentId,
      visibility,
      updatedAt: new Date(),
    }).where(eq(threads.id, id)).returning();

    res.status(200).json({ message: "Thread updated successfully", thread: updatedThread[0] });
  } catch (e) {
    console.error("Update thread error:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteThread = async (req, res) => {
  try {
    const { id } = req.params;
    const authorId = req.user.id;

    const thread = await db.select().from(threads).where(eq(threads.id, id));

    if (thread.length === 0) {
      return res.status(404).json({ error: "Thread not found" });
    }

    if (thread[0].authorId !== authorId) {
      return res.status(403).json({ error: "You are not authorized to delete this thread" });
    }

    await db.delete(threads).where(eq(threads.id, id));

    res.status(200).json({ message: "Thread deleted successfully" });
  } catch (e) {
    console.error("Delete thread error:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};
