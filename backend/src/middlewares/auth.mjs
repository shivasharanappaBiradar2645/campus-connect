import jwt from "jsonwebtoken";
import { JWT_SECRET_KEY } from "../config.mjs";
import { db } from "../models/db.mjs";
import { users } from "../models/schema.mjs";

async function authenticateToken(req, res, next){
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ error: "Access denied. Token missing." });
    }

    
    jwt.verify(token, JWT_SECRET_KEY, async (err, decoded) => {
      if (err) {
        return res.status(403).json({ error: "Invalid or expired token." });
      }

    const user = await db.select().from(users).where(eq(users.id,token.id));
    if (user[0].status != "active"){
        return res.status(404).json({error: "user is not valid"})
    }
      

      next();
    });
  } catch (e) {
    console.error("JWT verification failed:", e);
    res.status(500).json({ error: "Internal server error during authentication." });
  }
};

export {
    authenticateToken,
}
