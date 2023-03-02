import express from "express";
import userController from "../controller/userController.js";

const router = express.Router();

router.post("/userSignup", userController.userSignup);
router.post("/userLogin", userController.userLogin);
router.get('/departments',userController.departments)
router.get('/viewappoinment',userController.viewAppoinment)
router.get('/findDoctor',userController.findDoctror)

export default router;
