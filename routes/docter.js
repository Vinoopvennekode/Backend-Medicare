import express from "express";
import adminController from "../controller/adminController.js";
import appoinmentController from "../controller/appoinmentController.js";
import docterController from "../controller/docterController.js";

const router = express.Router();

router.post("/signup", docterController.docterSignup);
router.post("/register", docterController.docterRegister);
router.post("/login", docterController.docterLogin);
router.get("/statusChecking", docterController.StatusChecking);
router.post("/addAppoinment", appoinmentController.DRappoinment);
router.post('/viewappoinment',appoinmentController.viewAppoinment)
router.delete('/deleteAppoinment',appoinmentController.deleteAppoinment)
router.post("/leaveDays",docterController.leaveDays)
export default router;
