import express from "express";
import {
  getUser,
  updateProfile,
  deleteAccount,
} from "../controllers/userController.js";
import isAuthenticated from "../middleware/authMiddleware.js";
import profileUpload from "../middleware/profileUpload.js";

const userRouter = express.Router();

userRouter.get("/get-user", isAuthenticated, getUser);

userRouter.put(
  "/update-profile",
  isAuthenticated,
  profileUpload.single("profileImage"),
  updateProfile,
);

userRouter.delete("/delete-account", isAuthenticated, deleteAccount);

export default userRouter;
