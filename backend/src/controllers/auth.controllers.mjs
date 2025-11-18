import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import {comments, threads, users, votes} from "../models/schema.mjs";
import {db} from "../models/db.mjs";
import {eq} from "drizzle-orm";
import {JWT_SECRET_KEY} from "../config.mjs";
import {supabase} from "./avatar.upload.mjs";

export const login = async (req, res) => {
    try {
        const {username, password} = req.body;


        const user = await db.select().from(users).where(eq(users.username, username));

        if (!user || user.length < 1) {
            return res.status(404).json({error: "User does not exist"});
        }

        const currentUser = user[0];

        if (currentUser.status === "deleted") {
            return res.status(403).json({error: "User is deleted"});
        }

        const match = await bcrypt.compare(password, currentUser.password);
        if (!match) {
            return res.status(400).json({error: "Invalid password"});
        }
        delete currentUser.password;

        const token = jwt.sign({id: currentUser.id},
            JWT_SECRET_KEY,
            {expiresIn: "1d"}
        );

        res.status(200).json({
            message: "Login successful",
            token
        });
    } catch (e) {
        console.error("Login error:", e);
        res.status(500).json({error: "Internal server error"});
    }
};

export const register = async (req, res) => {
    try {
        const {username, name, email, password, image_url, department_id} = req.body;


        const existingUser = await db.select().from(users).where(eq(users.username, username));
        if (existingUser.length > 0) {
            return res.status(400).json({error: "Username already taken"});
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        if (image_url) {
            var {data} = supabase.storage.from('avatars').getPublicUrl(image_url);

        }

        await db.insert(users).values({
            username,
            email,
            name,
            password: hashedPassword,
            imageUrl: data.publicUrl || null,
            departmentId: department_id || null,
        });

        res.status(201).json({message: "User created successfully"});
    } catch (e) {
        console.error("Registration error:", e);
        res.status(500).json({error: e});
    }
};

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.user.id;
        const userProfile = await db.select().from(users).where(eq(users.id, userId));

        if (userProfile.length === 0) {
            return res.status(404).json({error: "User not found"});
        }

        const {password, ...userWithoutPassword} = userProfile[0];

        res.status(200).json(userWithoutPassword);
    } catch (e) {
        console.error("Get user profile error:", e);
        res.status(500).json({error: "Internal server error"});
    }
};


export const getUserProfileExtended = async (req, res) => {
    try {
        const userId = req.user.id;
        const userProfile = await db.select().from(users).where(eq(users.id, userId));

        if (userProfile.length === 0) {
            return res.status(404).json({error: "User not found"});
        }

        const {password, ...userWithoutPassword} = userProfile[0];
        const allThreads = await db.select().from(threads).where(eq(threads.authorId, userId));
        const allComments = await db.select().from(comments).where(eq(comments.authorId, userId));
        const voteThreads = await db
            .select()
            .from(threads)
            .innerJoin(votes, eq(threads.id, votes.threadId))
            .where(eq(votes.userId, userId));
        const voteComments = await db
            .select()
            .from(comments)
            .innerJoin(votes, eq(comments.id, votes.commentId))
            .where(eq(votes.userId, userId));

        res.status(200).json({
            profile: userWithoutPassword,
            thread: allThreads,
            voteThreads: voteThreads,
            voteComments: voteComments,
            comment: allComments,
        });
    } catch (e) {
        console.error("Get user profile error:", e);
        res.status(500).json({error: "Internal server error"});
    }
};

export const getUserId = async (req, res) => {
    try {
        res.status(200).json({userId: req.user.id});

    } catch (e) {
        res.status(500).json({error: "Internal server error"});
    }
}