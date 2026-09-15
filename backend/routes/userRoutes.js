import express from "express";
import { getUser } from "../controllers/userController.js";
import isAuthenticated from "../middleware/authMiddleware.js";

const userRouter = express.Router();

userRouter.get("/get-user", isAuthenticated, getUser);


export default userRouter;