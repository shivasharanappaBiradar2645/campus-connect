import { 
  serial, varchar, timestamp, pgTable, boolean, json, integer, text, bigint, pgEnum, uuid, unique 
} from "drizzle-orm/pg-core";


export const roleEnum = pgEnum("role",["admin","student","faculty"]);
export const statusEnum = pgEnum("status",["active","suspend","deleted"]);




export const users = pgTable("users",{
    id: serial("id").primaryKey(),
     username: varchar("username",{length:50}).notNull().unique(),
     email: varchar("email",{length: 150}).notNull().unique(),
     password: varchar("password",{length: 255}).notNull(),
     name: varchar("name",{length:100}).notNull(),
     imageUrl: varchar("image_url",{length:255}),
     status: statusEnum("status").default("active").notNull(),
     createdAt: timestamp("created_at").defaultNow().notNull(),
     updatedAt: timestamp("updated_at").defaultNow().notNull(),
     role: roleEnum("role").notNull().default("student"),

})


