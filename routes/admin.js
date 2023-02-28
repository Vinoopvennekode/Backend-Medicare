import express from "express";
import adminController from "../controller/adminController.js";
import jwt from "../utils/jwt.js";

const router = express.Router();

router.post("/adminLogin", adminController.AdminLogin);

router.get("/users", adminController.getusers);
router.post("/speciality", adminController.speciality);
router.get("/getdepartments", adminController.getSpeciality);
router.post("/editDept",adminController.editDept)
router.patch("/blockUser", adminController.blockUser);
router.patch("/unblockUser", adminController.unblockUser);
router.get("/doctors",jwt.verifyToken, adminController.getDoctors);
router.patch("/blockDoctor", adminController.blockDoctor);
router.patch("/unblockDoctor", adminController.unblockDoctor);
router.get("/pending", adminController.DoctorPending);
router.patch("/approve", adminController.approveDoctor);
router.post("/singledepartment", adminController.viewSpeciality);
router.delete('/deleteDepartment',adminController.deleteDepartment);



export default router;
