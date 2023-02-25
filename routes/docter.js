import express from "express";
import adminController from "../controller/adminController.js";
import docterController from "../controller/docterController.js";


const router = express.Router();

router.post("/signup", docterController.docterSignup);
router.post("/register", docterController.docterRegister);
router.post("/login", docterController.docterLogin);
router.get("/statusChecking",docterController.StatusChecking)
export default router;
