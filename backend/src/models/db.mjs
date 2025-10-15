import {Pool} from "pg";
import {drizzle} from "drizzle-orm/node-postgres";
import * as schema from "./schema.mjs";


const pool = new Pool({
    connectionString: config.DB_URL,
});

export const db = drizzle(pool,{
    schema
});