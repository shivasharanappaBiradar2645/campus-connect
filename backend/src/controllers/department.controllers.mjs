import { eq } from "drizzle-orm";
import { db } from "../models/db.mjs";
import { departments } from "../models/schema.mjs";


export const createDepartment = async (req,res) => {
    try{
        const {name,descripiton} = req.body;
        const depart = await db.select().from(departments).where(eq(departments.name,name));
        if (depart.length > 0){
            return res.status(500).json('department already exist');
        }
        const newdep = await db.insert(departments).values({
            name:name,
            description: descripiton,
        }).returning();

        res.json("successfully created");


    }catch(err){
        res.status(500).json(err)
    }
   
}

export const listDepartment = async (req,res) => {
    try{
        const dep = await db.select().from(departments);
        res.json(dep)
    }catch(err){
        res.status(500).json(err);
    }
}

export const deleteDepartment  = async (req,res) => {
    try{
        const {id } = req.body;
        const dep = await db.select().from(departments).where(eq(departments.id,id));
        if (dep.length == 0){
            return res.send("no such department");
        }
        await db.delete(departments).where(departments.id,id);
        res.send("deleted succesfully");
    }catch(err){
        res.status(500).json(err);
    }
}