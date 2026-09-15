import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import cors from "cors";
import cookiesParser from "cookie-parser";
import authRoutes from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import InterviewRouter from "./routes/interviewRoutes.js";
import paymentRouter from "./routes/paymentRoutes.js";
import path from "path";


dotenv.config({ quiet: true });

const requiredEnvVars = [
  "MONGO_URI",
  "JWT_SECRET",
  "OPENROUTER_API_KEY",
  "RAZORPAY_KEY_ID",
  "RAZORPAY_KEY_SECRET",
];

const missingEnvVars = requiredEnvVars.filter((key) => !process.env[key]);

if (missingEnvVars.length > 0) {
  console.error(
    `Missing required environment variables: ${missingEnvVars.join(", ")}`,
  );
  process.exit(1);
}

const allowedOrigins = (process.env.CLIENT_URL || "")
  .split(",")
  .map((origin) => origin.trim())
  .filter(Boolean);

if (process.env.NODE_ENV === "production" && allowedOrigins.length === 0) {
  console.error("CLIENT_URL must be configured in production.");
  process.exit(1);
}

const app = express();

app.use(express.json({ limit: "1mb" }));

app.use(
  cors({
    origin(origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (
        allowedOrigins.includes(origin) ||
        (process.env.NODE_ENV !== "production" &&
          origin === "http://localhost:5173")
      ) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  }),
);

app.use(cookiesParser());

app.use("/api/auth", authRoutes);
app.use("/api/user", userRouter);
app.use("/api/interview", InterviewRouter);
app.use("/api/payment", paymentRouter);

const PORT = process.env.PORT || 5005;

app.get("/", (req, res) => {
  res.send("Server is online");
});

app.use("/api", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API route not found",
  });
});

app.use((err, req, res, next) => {
  console.error("Unhandled server error:", err.message);

  if (res.headersSent) {
    return next(err);
  }

  const statusCode = err.statusCode || err.status || 500;

  res.status(statusCode).json({
    success: false,
    message:
      statusCode === 500
        ? "Internal server error"
        : err.message || "Request failed",
  });
});

const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.info(`Server running on port ${PORT}`);
  });
};

startServer().catch((error) => {
  console.error("Server startup failed:", error.message);
  process.exit(1);
});
