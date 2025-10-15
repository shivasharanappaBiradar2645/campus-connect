import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { users } from "../models/schema.mjs";
import { db } from "../models/db.mjs";
import { eq } from "drizzle-orm";
import { JWT_SECRET_KEY } from "../config.mjs";

export const login = async (req,res)=>{
    try{
        const {username,password} = req.body;
        const user = await db.select().from(users).where(eq(user.username,username));
        if (user[0].status === "deleted" || user.length <1 ){
            return res.status(404).send("user is deleted or doesnt exist");
        }
        const match = await bcrypt.compare(password,user[0].password);
        if (!match){
            return res.status(400).send("invalid password");
        }
        const token = jwt.sign({ userId: user[0].id,role: user[0].role }, JWT_SECRET_KEY);
        res.json({token});
    }catch(e){
        res.status(500).json({error:e})
    }
}

export const register = async (req,res)=>{
    try{
    const {username,name,password,image_url} = req.body;
    const hashedpassword = await bcrypt.hash(password,10);
    await db.insert(users).values({
        username:username,
        name:name,
        password: hashedpassword,
        imageUrl: image_url,
    })
    res.status(201).json("user created");
    }catch(e){
        res.status(500).json({error:e})
    }
}