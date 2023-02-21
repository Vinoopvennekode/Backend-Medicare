import express from "express";
import docterController from "../controller/docterController.js";


const router = express.Router();

router.post("/signup", docterController.docterSignup);
router.post("/register", docterController.docterRegister);
router.post("/login", docterController.docterLogin);
export default router;
