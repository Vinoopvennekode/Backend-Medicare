import express from "express";
import userController from "../controller/userController.js";

const router = express.Router();

router.post("/userSignup", userController.userSignup);
router.post("/userLogin", userController.userLogin);
router.get('/departments',userController.departments)

export default router;
