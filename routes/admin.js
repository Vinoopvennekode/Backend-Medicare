import express from "express";
import adminController from "../controller/adminController.js";
import jwt from "../utils/jwt.js";

const router = express.Router();

router.post("/adminLogin", adminController.AdminLogin);

router.get('/dashboard',jwt.verifyToken,adminController.dashboard)

router.get("/users", jwt.verifyToken, adminController.getusers);

router.post("/speciality", jwt.verifyToken, adminController.speciality);

router.get("/getdepartments", jwt.verifyToken, adminController.getSpeciality);

router.post("/editDept", jwt.verifyToken, adminController.editDept);

router.patch("/blockUser", jwt.verifyToken, adminController.blockUser);

router.patch("/unblockUser", jwt.verifyToken, adminController.unblockUser);

router.get("/doctors", jwt.verifyToken, adminController.getDoctors);

router.get('/appoinments',jwt.verifyToken,adminController.Appoinments)

router.patch("/blockDoctor", jwt.verifyToken, adminController.blockDoctor);

router.patch("/unblockDoctor", jwt.verifyToken, adminController.unblockDoctor);

router.get("/pending", jwt.verifyToken, adminController.DoctorPending);

router.patch("/approve", jwt.verifyToken, adminController.approveDoctor);

router.patch("/reject", jwt.verifyToken, adminController.rejectDoctor);

router.post(
  "/singledepartment",
  jwt.verifyToken,
  adminController.viewSpeciality
);

router.delete(
  "/deleteDepartment",
  jwt.verifyToken,
  adminController.deleteDepartment
);

export default router;
