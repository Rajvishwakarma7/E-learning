import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

import userRoutes from "./routes/user.routes.js";
import courseRoutes from "./routes/course.routes.js";

import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config({});

// call db connection
connectDB();
const app = express();
const PORT = process.env.PORT || 3000;

// default middleware
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:5173",
    credentials: true,
    optionsSuccessStatus: 200,
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/course", courseRoutes);

app.get("/newuser", (req, res) => {
  return res.send("this is testing msg");
});
app.listen(PORT, () => {
  console.log("server run at ", PORT);
});
