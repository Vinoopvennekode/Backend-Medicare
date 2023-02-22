import express from "express";
import adminController from "../controller/adminController.js";
import jwtAuth from "../utils/jwt.js";

const router = express.Router();

router.post("/adminLogin", adminController.AdminLogin);
router.get("/isadmin", jwtAuth.jwtAdmin, adminController.isAdmin);
router.get("/users", adminController.getusers);
router.post("/speciality", adminController.speciality);
router.get("/getdepartments", adminController.getSpeciality);
router.patch("/blockUser", adminController.blockUser);
router.patch("/unblockUser", adminController.unblockUser);
router.get("/doctors", adminController.getDoctors);
router.patch("/blockDoctor", adminController.blockDoctor);
router.patch("/unblockDoctor", adminController.unblockDoctor);
router.get("/pending", adminController.DoctorPending);
router.patch("/approve", adminController.approveDoctor);
router.post("/singledepartment", adminController.viewSpeciality);
export default router;
