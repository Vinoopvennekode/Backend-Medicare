import express from "express";
import userController from "../controller/userController.js";
import jwt from "../utils/jwt.js";

const router = express.Router();

router.post("/userSignup", userController.userSignup);
router.post("/userLogin", userController.userLogin);
router.get("/departments", userController.departments);
router.get("/doctors",userController.getDoctors)
router.get("/viewappoinment",jwt.verifyToken, userController.viewAppoinment);
router.get("/findDoctor", jwt.verifyToken,userController.findDoctror);
router.post("/postAppointment",jwt.verifyToken, userController.postAppointmnet);
router.post("/otpverify",  jwt.verifyToken,userController.otpVerify);
router.post('/numberCheck',userController.NumberCheck)
router.post('/setNewPassword',userController.setNewPassword)
router.post('/forgotOtpVerify',userController.forgotOtpVerify)
router.patch('/notificationDeleteAllRead',jwt.verifyToken,userController.notificationDeleteAllRead)
router.patch('/notificationMarkAllRead',jwt.verifyToken,userController.notificationMarkAllRead)
router.post('/getAllNotifications',jwt.verifyToken,userController.getAllNotifications)
router.get('/getDoctors/doctors',jwt.verifyToken,userController.getDoctor)

export default router;
