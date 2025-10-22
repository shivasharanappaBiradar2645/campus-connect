import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { users } from "../models/schema.mjs";
import { db } from "../models/db.mjs";
import { eq } from "drizzle-orm";
import { JWT_SECRET_KEY } from "../config.mjs";

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

   
    const user = await db.select().from(users).where(eq(users.username, username));

    if (!user || user.length < 1) {
      return res.status(404).json({ error: "User does not exist" });
    }

    const currentUser = user[0];

    if (currentUser.status === "deleted") {
      return res.status(403).json({ error: "User is deleted" });
    }

    const match = await bcrypt.compare(password, currentUser.password);
    if (!match) {
      return res.status(400).json({ error: "Invalid password" });
    }

    const token = jwt.sign(currentUser,
      JWT_SECRET_KEY,
      { expiresIn: "1d" }
    );

    res.status(200).json({ 
      message: "Login successful", 
      token
    });
  } catch (e) {
    console.error("Login error:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const register = async (req, res) => {
  try {
    const { username, name, email, password, image_url, department_id } = req.body;

   
    const existingUser = await db.select().from(users).where(eq(users.username, username));
    if (existingUser.length > 0) {
      return res.status(400).json({ error: "Username already taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.insert(users).values({
      username,
      email,
      name,
      password: hashedPassword,
      imageUrl: image_url || null,
      departmentId: department_id || null,
    });

    res.status(201).json({ message: "User created successfully" });
  } catch (e) {
    console.error("Registration error:", e);
    res.status(500).json({ error: "Internal server error" });
  }
};
