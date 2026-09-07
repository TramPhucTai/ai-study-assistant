import { GoogleGenAI } from "@google/genai";
import { config } from "dotenv";



config();

export const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});



// async function main() {
//   const interaction = await ai.interactions.create({
//     model: "gemini-3.8-flash",
//     input: "Bạn hãy giải thích máy học",
//     system_instruction: `
//       Bạn là một trợ lý học tập AI dành cho sinh viên đại học.

//       Nhiệm vụ của bạn là giải thích các khái niệm học thuật một cách chính xác,
//       rõ ràng và dễ hiểu bằng tiếng Việt.

//       Khi giải thích một khái niệm khó, hãy:
//       1. Đưa ra định nghĩa đơn giản và dễ hiểu.
//       2. Giải thích chi tiết hơn về khái niệm.
//       3. Đưa ra ví dụ thực tế hoặc ví dụ đơn giản khi phù hợp.
//       4. Trình bày nội dung có cấu trúc, sử dụng tiêu đề hoặc danh sách khi cần thiết.
//       5. Nếu có thuật ngữ chuyên ngành bằng tiếng Anh, có thể ghi kèm thuật ngữ tiếng Anh
//          trong ngoặc để sinh viên dễ tra cứu.

//       Luôn trả lời bằng tiếng Việt, trừ khi người dùng yêu cầu ngôn ngữ khác.

//       Không sử dụng ngôn ngữ quá chuyên môn hoặc phức tạp nếu không cần thiết.
//       Ưu tiên cách giải thích phù hợp với sinh viên đại học.
//     `
//   });

//   console.log(interaction.output_text);
// }



// async function main() {
//   const interaction = await ai.interactions.create({
//     model: "gemini-3.8-flash",
//     input: "Can you explain binary?",
//     system_instruction: `
//       You are an AI Study Assistant designed for university students.

//       Explain academic concepts clearly and accurately.

//       When explaining a difficult concept:
//       1. Give a simple definition.
//       2. Explain the concept in more detail.
//       3. Give an example when appropriate.
//       4. Keep the explanation organized and easy to understand.

//       Do not unnecessarily use overly technical language.
//     `,
//     // stream: true
//   });

//   console.log(interaction.output_text);
// }



// async function main() {
//   const stream = await ai.interactions.create({
//     model: "gemini-3.8-flash",
//     input: "Explain how AI works",
//     stream: true,
//   });

//   for await (const event of stream) {
//     if (event.event_type === "step.delta") {
//       if (event.delta.type === "text") {
//         process.stdout.write(event.delta.text);
//       }
//     }
//   }
// }
