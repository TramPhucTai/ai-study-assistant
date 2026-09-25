export function createQuizSchema(questionCount) {
  return {
    type: "object",

    properties: {
      questions: {
        type: "array",

        description:
          "Danh sách câu hỏi trắc nghiệm được tạo từ tài liệu PDF.",

        minItems: questionCount,
        maxItems: questionCount,

        items: {
          type: "object",

          properties: {
            question: {
              type: "string",
              description:
                "Nội dung câu hỏi trắc nghiệm.",
            },

            options: {
              type: "array",
              description:
                "Bốn phương án trả lời cho câu hỏi.",

              minItems: 4,
              maxItems: 4,

              items: {
                type: "string",
              },
            },

            correctAnswer: {
              type: "integer",

              description:
                "Chỉ số của đáp án đúng trong mảng options. " +
                "Giá trị từ 0 đến 3.",

              minimum: 0,
              maximum: 3,
            },
          },

          required: [
            "question",
            "options",
            "correctAnswer",
          ],

          additionalProperties: false,
        },
      },
    },

    required: ["questions"],

    additionalProperties: false,
  };
}