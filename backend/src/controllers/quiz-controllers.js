import Conversation from "../models/Conversation.js";
import Document from "../models/Document.js";
import { generateQuizFromDocument } from "../services/quiz-service.js";



export async function generateQuiz(req, res) {
  try {
    const { conversationId, questionCount, difficulty } = req.body;

    const userId = res.locals.jwtData.id;

    if (!conversationId || !questionCount || !difficulty) {
      return res
        .status(400)
        .json({
          message:
            "conversationId, questionCount and difficulty are required.",
        });
    }

    const parsedQuestionCount = Number(questionCount);

    if (parsedQuestionCount < 1 || parsedQuestionCount > 20) {
      return res
        .status(400)
        .json({
          message:
            "Question count must be between 1 and 20.",
        });
    }

    const allowedDifficulties = ["Dễ", "Trung bình", "Khó"];

    if (!allowedDifficulties.includes(difficulty)) {
      return res
        .status(400)
        .json({
          message:
            "Invalid difficulty.",
        });
    }

    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId,
    });

    if (!conversation) {
      return res
        .status(404)
        .json({
          message:
            "Conversation not found.",
        });
    }

    const document = await Document.findOne({
      _id:
        conversation.documentId,
      userId,
    });

    if (!document) {
      return res
        .status(404)
        .json({
          message:
            "Document not found.",
        });
    }

    const quiz = await generateQuizFromDocument({
      document,
      questionCount:
        parsedQuestionCount,
      difficulty,
    });

    return res
      .status(200)
      .json({
        message:
          "Quiz generated successfully",

        questions:
          quiz.questions,
      });

  } catch (error) {

    console.error(
      "Generate quiz error:",
      error
    );

    return res
      .status(500)
      .json({
        message: "Unable to generate quiz.",
        error:
          error.message,
      });
  }
}