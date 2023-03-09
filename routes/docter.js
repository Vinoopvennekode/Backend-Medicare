import express from "express";
import adminController from "../controller/adminController.js";
import appoinmentController from "../controller/appoinmentController.js";
import docterController from "../controller/docterController.js";
import jwt from "../utils/jwt.js";
const router = express.Router();

router.post("/signup", docterController.docterSignup);
router.post("/register", docterController.docterRegister);
router.post("/login", docterController.docterLogin);
router.get("/statusChecking", docterController.StatusChecking);
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
router.post(
  "/getappoinments",
  jwt.verifyToken,
  docterController.getAppoinments
);
router.post("/leaveDays", docterController.leaveDays);
router.get("/timeslots", jwt.verifyToken, docterController.timeSlots);
router.post("/allotedTime", jwt.verifyToken, docterController.allotedTime);

export default router;
