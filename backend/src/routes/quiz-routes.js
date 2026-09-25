import { Router } from "express";
import { verifyToken } from "../utils/token-manager.js";
import { generateQuiz } from "../controllers/quiz-controllers.js";



const quizRoutes = Router();

quizRoutes.post(
  "/generate",
  verifyToken,
  generateQuiz
);

export default quizRoutes;