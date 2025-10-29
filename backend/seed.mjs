import { db } from "./src/models/db.mjs";
import { users } from "./src/models/schema.mjs";
import bcrypt from "bcrypt"

const hashedPassword = await bcrypt.hash("admin123",10);

const seed = async() => {
await db.insert(users).values({
    username: "admin",
    password: hashedPassword,
    email: "shiva@example.com",
    imageUrl: null,
    name: "Admin",
    role: "admin",
    departmentId: null,
});}

seed();