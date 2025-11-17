import  dotenv from "dotenv";

dotenv.config({ path: ".env" });


export const JWT_SECRET_KEY = process.env.JWT_KEY;
  
export const DATABASE_URL= process.env.DB_URL
export const SUPABASE_URL = process.env.SUPABASE_URL

export const SUPABASE_API_KEY = process.env.SUPABASE_KEY

console.log(JWT_SECRET_KEY)