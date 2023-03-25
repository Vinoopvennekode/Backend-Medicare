import express from "express";
import adminController from "../controller/adminController.js";
import appoinmentController from "../controller/appoinmentController.js";
import doctorController from "../controller/doctorController.js";
import jwt from "../utils/jwt.js";
const router = express.Router();

router.post("/signup", doctorController.doctorSignup);
router.post("/register", doctorController.doctorRegister);
router.post("/login", doctorController.doctorLogin);
router.get("/statusChecking", doctorController.StatusChecking);
router.post(
  "/addAppoinment",
  jwt.verifyToken,
  appoinmentController.DRappoinment
);
router.post(
  "/viewappoinment",
  jwt.verifyToken,
  appoinmentController.viewAppoinment
);
router.delete(
  "/deleteAppoinment",
  jwt.verifyToken,
  appoinmentController.deleteAppoinment
);

router.delete('/deleteAccount',doctorController.deleteAccount)
router.post(
  "/getappoinments",
  jwt.verifyToken,
  doctorController.getAppoinments
);
router.post("/leaveDays", doctorController.leaveDays);
router.get("/timeslots", jwt.verifyToken, doctorController.timeSlots);
router.post("/allotedTime", jwt.verifyToken, doctorController.allotedTime);
router.post('/profile',jwt.verifyToken,doctorController.getProfile)
router.post('/updateProfile',jwt.verifyToken,doctorController.updateProfile)
router.post('/appoinmentHistory',jwt.verifyToken,doctorController.appoinmentHistory)
router.post('/checked',jwt.verifyToken,doctorController.checked)
router.post('/setNewPassword',doctorController.setNewPassword)
router.post('/forgotOtpVerify',doctorController.forgotOtpVerify)
router.post('/numberCheck',doctorController.NumberCheck)
router.post('/dashboard',jwt.verifyToken,doctorController.dashboard)
router.post('/cancelAppoinment',jwt.verifyToken,doctorController.cancelAppoinment)
export default router;
