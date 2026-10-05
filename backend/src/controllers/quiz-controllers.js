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

    if (
      error.status === 429 ||
      error.statusCode === 429
    ) {
      return res
        .status(429)
        .json({
          message:
            "Hệ thống AI đang nhận quá nhiều yêu cầu. Vui lòng thử lại sau ít phút.",
        });
    }

    if (
      error.status === 503 ||
      error.statusCode === 503
    ) {
      return res
        .status(503)
        .json({
          message:
            "Dịch vụ AI hiện đang quá tải. Vui lòng thử lại sau.",
        });
    }

    return res
      .status(500)
      .json({
        message:
          "Đã xảy ra lỗi khi tạo quiz.",
      });
  }
}