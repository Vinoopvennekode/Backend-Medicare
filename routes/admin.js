import express from "express";
import adminController from "../controller/adminController.js";
import jwtAuth from '../utils/jwt.js'

const router = express.Router();

router.post("/adminLogin", adminController.AdminLogin);
router.get("/isadmin", jwtAuth.jwtAdmin,adminController.isAdmin);

export default router;
