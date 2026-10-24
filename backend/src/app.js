import "dotenv/config";
import express from "express";
import morgan from "morgan";
import appRouter from "./routes/index.js";
import cookieParser from "cookie-parser";
import cors from "cors";



const app = express();

// Middleware
app.use(cors({
  origin: "https://ai-study-assistant-frontend-xw6x.onrender.com",
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET))

app.use(morgan("dev"))

app.use("/api/v1", appRouter);

export default app;
