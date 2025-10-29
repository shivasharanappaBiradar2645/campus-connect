import { db } from "../models/db.mjs";
import { voteEnum, votes } from "../models/schema.mjs";
import { eq, and,count } from "drizzle-orm";

export const createVote = async (req, res) => {
  try {
    const { threadId, commentId, type } = req.body;
    const userId = req.user.id;

    if (!threadId && !commentId) {
      return res.status(400).json({ error: "Either threadId or commentId is required" });
    }

    if (threadId && commentId) {
      return res.status(400).json({ error: "Cannot vote on both a thread and a comment simultaneously" });
    }

    const existingVote = await db.select().from(votes).where(
      and(
        eq(votes.userId, userId),
        threadId ? eq(votes.threadId, threadId) : undefined,
        commentId ? eq(votes.commentId, commentId) : undefined
      )
    );

    if (existingVote.length > 0) {
      return res.status(409).json({ error: "User has already voted on this item" });
    }

    const newVote = await db.insert(votes).values({
      threadId,
      commentId,
      userId,
      type,
    }).returning();

    res.status(201).json({ message: "Vote recorded successfully", vote: newVote[0] });
  } catch (e) {
    console.error("Vote creation error:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteVote = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const vote = await db.select().from(votes).where(eq(votes.id, id));

    if (vote.length === 0) {
      return res.status(404).json({ error: "Vote not found" });
    }

    if (vote[0].userId !== userId) {
      return res.status(403).json({ error: "You are not authorized to delete this vote" });
    }

    await db.delete(votes).where(eq(votes.id, id));

    res.status(200).json({ message: "Vote deleted successfully" });
  } catch (e) {
    console.error("Delete vote error:", e);
    res.status(500).json({ error: e});
  }
};

export const countVote = async (req,res) => {
  try{
    const { id } = req.params;
    const upvote = await db.$count(votes,and(eq(votes.threadId,id),eq(votes.type, voteEnum.upvote)));
    const downvote = await db.$count(votes, and(eq(votes.threadId,id),eq(votes.type,voteEnum.downvote)));
    res.json({upvote: upvote, downvote: downvote});


  }catch (e){
    res.status(500).json({error: e.message})
  }
}