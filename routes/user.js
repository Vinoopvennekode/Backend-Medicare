import express from "express";
import userController from "../controller/userController.js";
import jwt from "../utils/jwt.js";

const router = express.Router();

router.post("/userSignup", userController.userSignup);
router.post("/userLogin", userController.userLogin);
router.get("/departments", userController.departments);
router.get("/doctors",userController.getDoctors)
router.get("/viewappoinment", userController.viewAppoinment);
router.get("/findDoctor", userController.findDoctror);
router.post("/postAppointment", userController.postAppointmnet);
router.post("/otpverify",  jwt.verifyToken,userController.otpVerify);
router.post('/numberCheck',userController.NumberCheck)
router.post('/setNewPassword',userController.setNewPassword)
router.post('/forgotOtpVerify',userController.forgotOtpVerify)
router.patch('/notificationDeleteAllRead',userController.notificationDeleteAllRead)
router.patch('/notificationMarkAllRead',userController.notificationMarkAllRead)
router.post('/getAllNotifications',userController.getAllNotifications)
router.get('/getDocters/doctors',userController.getDocters)

export default router;
