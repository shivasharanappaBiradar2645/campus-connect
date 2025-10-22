import {Pool} from "pg";
import {drizzle} from "drizzle-orm/node-postgres";
import * as schema from "./schema.mjs";
import config from "../config.mjs"


const pool = new Pool({
    connectionString: config.DATABASE_URL,
});

export const db = drizzle(pool,{
    schema
});