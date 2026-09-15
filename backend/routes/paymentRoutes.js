import express from "express";
import isAuthenticated from "../middleware/authMiddleware.js";
import { createOrder, verifyPayment } from "../controllers/paymentController.js";


const paymentRouter = express.Router();

paymentRouter.post("/order", isAuthenticated, createOrder);
paymentRouter.post("/verify", isAuthenticated, verifyPayment);

export default paymentRouter;
