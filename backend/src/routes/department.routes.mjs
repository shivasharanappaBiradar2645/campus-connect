import express from "express";
import { createDepartment, deleteDepartment, listDepartment } from "../controllers/department.controllers.mjs";
import { authenticateToken } from "../middlewares/auth.mjs";
import { authorize } from "../middlewares/authorisation.mjs";


const router = express.Router();

router.get('/',authenticateToken,listDepartment);
router.post('/',authenticateToken,authorize('admin'), createDepartment);
router.delete('/',authenticateToken, authorize('admin') ,deleteDepartment);


export default router;