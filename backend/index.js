import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import cookiesParser from "cookie-parser";

import authRoutes from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import InterviewRouter from "./routes/interviewRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";

dotenv.config();

const app = express();

app.use(express.json());

app.use(
  cors({
    origin: "https://intelliprep-ai.onrender.com/ || http://localhost:5173",
    credentials: true,
  }),
);

app.use(cookiesParser());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/user", userRouter);
app.use("/api/interview", InterviewRouter);
app.use("/api/payment", paymentRouter);

const PORT = process.env.PORT || 5005;

app.get("/", (req, res) => {
  res.send("Server is online");
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
