import express from "express"
import { newUpload } from "../controllers/avatar.upload.mjs";

const router = express.Router();

router.post("/",newUpload);

export default router;