import { defineConfig } from "drizzle-kit";
import config from "./src/config/config.mjs";


export default defineConfig({
dialect: "postgresql",
schema: "./src/model/schema.mjs",
out: "./drizzle",
dbCredentials: {
url: "postgresql://postgres.rzhofmeljzgphudrsqub:k6wmUdK5yGFif4DQ@aws-1-ap-south-1.pooler.supabase.com:6543/postgres",
}
});