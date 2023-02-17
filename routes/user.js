import express from "express";
import userController from "../controller/userController.js";

const router = express.Router();

router.post("/userSignup", userController.userSignup);
router.post("/userLogin", userController.userLogin);

export default router;
