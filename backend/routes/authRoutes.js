import express from "express";
import { sendOtp, verifyOtp, googleAuth, logout } from "../controllers/authController.js";

const router = express.Router();

router.post("/send-otp", sendOtp);

router.post("/verify-otp", verifyOtp);

router.post("/google", googleAuth);

router.get("/logout", logout);



export default router;
