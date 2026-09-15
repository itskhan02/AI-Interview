import express from "express";
import isAuthenticated from "../middleware/authMiddleware.js";
import { upload } from "../middleware/multer.js";
import { analyzeResume, finishInterview, generateQuestions, getInterviewReport, getMyInterviews, submitAnswer } from "../controllers/interviewController.js";


const InterviewRouter = express.Router();

InterviewRouter.post("/resume", isAuthenticated, upload.single("resume"), analyzeResume);
InterviewRouter.post("/generate-questions", isAuthenticated, generateQuestions);
InterviewRouter.post("/submit-answer", isAuthenticated, submitAnswer);
InterviewRouter.post("/finish", isAuthenticated, finishInterview);

InterviewRouter.get("/get-Interview", isAuthenticated, getMyInterviews);
InterviewRouter.get("/report/:id", isAuthenticated, getInterviewReport);

export default InterviewRouter;
