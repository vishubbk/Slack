// src/app.js

import dotenv from "dotenv";
dotenv.config();

import express from "express";
import morgan from "morgan";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Routes
import userRouter from "./routes/user-route.js";
import workspaceRouter from "./routes/workspace-route.js";
import channelRouter from "./routes/channel-route.js";
import messageRouter from "./routes/message-route.js";
import callRouter from "./routes/call-route.js";
import dmRoutes from "./routes/dm-route.js";

// Middlewares
import { notFound } from "./middlewares/notFound.js";
import { errorHandler } from "./middlewares/errorHandler.js";

const app = express();

/* ===============================
   GLOBAL MIDDLEWARES
================================ */

// Security headers
app.use(helmet());

// Rate limiting (prevent abuse)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 300, // max requests per IP
});
app.use(limiter);

// Logging (only in development)
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Cookie parser
app.use(cookieParser());

// CORS
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);

/* ===============================
   HEALTH CHECK
================================ */

app.get("/api/v1/health", (req, res) => {
  res.status(200).json({
    status: "success",
    message: "Slack Clone API running 🚀",
  });
});

/* ===============================
   ROUTES
================================ */

app.use("/api/v1/users", userRouter);
app.use("/api/v1/workspaces", workspaceRouter);
app.use("/api/v1/channels", channelRouter);
app.use("/api/v1/messages", messageRouter);
app.use("/api/v1/calls", callRouter);
app.use("/api/v1/dm", dmRoutes);

/* ===============================
   ERROR HANDLING
================================ */

// 404
app.use(notFound);

// Global error handler
app.use(errorHandler);

export default app;
