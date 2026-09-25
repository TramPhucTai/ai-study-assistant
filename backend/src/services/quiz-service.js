import { ai } from "../config/gemini-config.js";
import { ensureGeminiFile } from "./gemini-file-service.js";
import { createQuizSchema } from "../schemas/quiz-schema.js";



export async function generateQuizFromDocument({ document, questionCount, difficulty }) {
  /*
   * Make sure the PDF exists in Gemini.
   * If the old Gemini file expired,
   * ensureGeminiFile() should upload it again
   * from S3.
   */
  await ensureGeminiFile(document);

  if (!document.geminiFileUri) {
    throw new Error(
      "Gemini file URI is not available."
    );
  }

  const quizSchema =  createQuizSchema(questionCount);

  const prompt = `
    Bạn là trợ lý học tập cho sinh viên.

    Hãy đọc tài liệu PDF được cung cấp và tạo một bài quiz trắc nghiệm.

    Yêu cầu:

    - Số lượng câu hỏi: ${questionCount}
    - Độ khó: ${difficulty}
    - Mỗi câu hỏi phải có chính xác 4 phương án trả lời.
    - Chỉ có 1 phương án đúng cho mỗi câu hỏi.
    - Nội dung câu hỏi phải dựa trên tài liệu PDF.
    - Không tạo câu hỏi về nội dung không xuất hiện trong tài liệu.
    - Các phương án sai phải hợp lý và có liên quan đến câu hỏi.
    - Không tạo các câu hỏi giống nhau.
    - Sử dụng tiếng Việt.
    - correctAnswer là vị trí của đáp án đúng trong mảng options:
      0 = phương án đầu tiên
      1 = phương án thứ hai
      2 = phương án thứ ba
      3 = phương án thứ tư

    Độ khó "${difficulty}" cần được hiểu như sau:

    - Dễ:
      tập trung vào kiến thức cơ bản, định nghĩa,
      khái niệm và thông tin trực tiếp trong tài liệu.

    - Trung bình:
      yêu cầu hiểu và áp dụng kiến thức,
      không chỉ ghi nhớ trực tiếp.

    - Khó:
      yêu cầu phân tích, liên hệ hoặc áp dụng
      nhiều phần kiến thức trong tài liệu.

    Chỉ sử dụng nội dung của tài liệu PDF để tạo câu hỏi.
  `;



  const interaction =
    await ai.interactions.create({
      model: "gemini-3.8-flash",

      input: [
        {
          type: "document",
          uri: document.geminiFileUri,
          mime_type:
            document.mimeType ??
            "application/pdf",
        },

        {
          type: "text",
          text: prompt,
        },
      ],

      response_format: {
        type: "text",

        mime_type:
          "application/json",

        schema: quizSchema,
      },
    });

  const quiz = JSON.parse(interaction.output_text);

  validateQuiz(quiz, questionCount);

  return quiz;
}



function validateQuiz(quiz, questionCount ) {
  if (!quiz || !Array.isArray(quiz.questions)) {
    throw new Error(
      "Gemini returned an invalid quiz."
    );
  }

  if (quiz.questions.length !== questionCount) {
    throw new Error(
      `Expected ${questionCount} questions but received ${quiz.questions.length}.`
    );
  }

  for (const question of quiz.questions) {
    if (!Array.isArray(question.options) || question.options.length !== 4) {
      throw new Error(
        "Each quiz question must contain exactly four options."
      );
    }

    if (question.correctAnswer < 0 || question.correctAnswer > 3) {
      throw new Error(
        "Invalid correctAnswer index."
      );
    }
  }
}