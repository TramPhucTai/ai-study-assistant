import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";
import Document from "../models/Document.js";
import { ai, geminiModel } from "../config/gemini-config.js";
import { STUDY_ASSISTANT_SYSTEM_INSTRUCTION } from "../utils/constants.js";
import {
  attachPdfToGemini,
  ensureGeminiFile
} from "../services/gemini-file-service.js";

// Gửi một sự kiện dưới dạng JSON trên mỗi dòng để Frontend đọc dữ liệu theo luồng.
function sendStreamEvent(res, event) {
  res.write(`${JSON.stringify(event)}\n`);
}

// Cập nhật nội dung của một bước phản hồi từ Gemini dựa trên phần dữ liệu mới nhận được.
function applyDeltaToStep(step, delta) {
  if (delta.type === "text") {
    if (!step.content) {
      step.content = [];
    }

    // Tìm phần văn bản hiện có để nối nội dung mới vào đúng vị trí.
    let textContent = step.content.find(
      (item) => item.type === "text"
    );

    // Tạo phần văn bản nếu bước phản hồi chưa có nội dung dạng text.
    if (!textContent) {
      textContent = {
        type: "text",
        text: ""
      };

      step.content.push(textContent);
    }

    textContent.text += delta.text;
    return;
  }

  // Lưu chữ ký suy luận do Gemini cung cấp để giữ lại dữ liệu của bước phản hồi.
  if (delta.type === "thought_signature") {
    step.signature = delta.signature;
    return;
  }

  // Thu thập các phần tóm tắt suy luận nếu Gemini trả về loại dữ liệu này.
  if (delta.type === "thought_summary") {
    if (!step.summary) {
      step.summary = [];
    }

    if (delta.content) {
      step.summary.push(delta.content);
    }
  }
}

export const generateChatCompletion = async (req, res) => {
  try {
    const {
      message,
      conversationId
    } = req.body;

    console.log(
      "Gemini request:",
      new Date().toISOString()
    );

    // Kiểm tra câu hỏi có tồn tại, đúng kiểu chuỗi và không chỉ chứa khoảng trắng.
    if (
      !message ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        message: "Message is required"
      });
    }

    // Kiểm tra mã hội thoại có được cung cấp và đúng định dạng ObjectId của MongoDB.
    if (
      !conversationId ||
      !mongoose.isValidObjectId(conversationId)
    ) {
      return res.status(400).json({
        message: "Valid conversation ID is required"
      });
    }

    // Lấy mã người dùng từ thông tin xác thực đã được middleware kiểm tra.
    const userId = res.locals.jwtData.id;

    // Tìm hội thoại theo mã hội thoại và mã người dùng để bảo đảm đúng quyền truy cập.
    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId
    });

    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found"
      });
    }

    // Chỉ tiếp tục khi hội thoại đã được liên kết với một tài liệu PDF.
    if (!conversation.documentId) {
      return res.status(400).json({
        message:
          "This conversation does not have a PDF document attached"
      });
    }

    // Truy vấn tài liệu PDF thuộc người dùng hiện tại.
    let document = await Document.findOne({
      _id: conversation.documentId,
      userId
    });

    if (!document) {
      return res.status(404).json({
        message: "PDF document not found"
      });
    }

    // Bảo đảm tệp PDF đã có bản tham chiếu hợp lệ trên Gemini.
    // Nếu tệp Gemini đã hết hạn, hàm này có thể tải lại tệp từ Amazon S3.
    document = await ensureGeminiFile(document);

    // Kiểm tra URI của tệp Gemini và thời điểm hết hạn.
    // Chừa thêm 5 phút để hạn chế việc sử dụng tệp sắp hết hạn trong lúc gửi yêu cầu.
    const fiveMinutes = 5 * 60 * 1000;

    const geminiFileExpired =
      !document.geminiFileUri ||
      !document.geminiExpirationTime ||
      new Date(document.geminiExpirationTime).getTime() <=
        Date.now() + fiveMinutes;

    // Tải PDF lên Gemini lại từ Amazon S3 nếu tệp chưa tồn tại
    // hoặc thời hạn sử dụng không còn đủ an toàn.
    if (geminiFileExpired) {
      document = await attachPdfToGemini(document);
    }

    // Dừng xử lý nếu vẫn không lấy được URI của tệp PDF trên Gemini.
    if (!document.geminiFileUri) {
      throw new Error(
        "Unable to obtain Gemini file URI"
      );
    }

    // Tạo dữ liệu câu hỏi để lưu vào lịch sử hội thoại.
    // Chỉ lưu văn bản, không lưu URI của tệp Gemini vì URI có thể hết hạn.
    const storedUserStep = {
      type: "user_input",
      content: [
        {
          type: "text",
          text: message.trim()
        }
      ]
    };

    // Tạo dữ liệu đầu vào gửi Gemini, bao gồm câu hỏi và tài liệu PDF đính kèm.
    // URI và MIME type giúp Gemini xác định tài liệu cần sử dụng để trả lời.
    const geminiUserStep = {
      type: "user_input",
      content: [
        {
          type: "text",
          text: message.trim()
        },
        {
          type: "document",
          uri: document.geminiFileUri,
          mime_type:
            document.mimeType ||
            "application/pdf"
        }
      ]
    };

    // Chuyển lịch sử hội thoại đã lưu sang dữ liệu đầu vào phù hợp,
    // sau đó thêm câu hỏi hiện tại cùng tài liệu PDF.
    const requestHistory = [
      ...conversation.geminiHistory.map((step) => {
        // Chuyển tài liệu Mongoose về đối tượng JavaScript thông thường nếu cần.
        if (typeof step.toObject === "function") {
          return step.toObject();
        }

        return step;
      }),
      geminiUserStep
    ];

    // Gửi toàn bộ ngữ cảnh hội thoại đến Gemini và nhận phản hồi theo luồng.
    // store: false yêu cầu không lưu tương tác trên hệ thống Gemini theo cơ chế lưu trữ của API.
    const stream = await ai.interactions.create({
      model: geminiModel,
      store: false,
      stream: true,
      input: requestHistory,
      system_instruction: STUDY_ASSISTANT_SYSTEM_INSTRUCTION
    });

    // Thiết lập phản hồi NDJSON để Frontend nhận và hiển thị từng phần văn bản.
    res.status(200);

    res.setHeader(
      "Content-Type",
      "application/x-ndjson; charset=utf-8"
    );

    res.setHeader(
      "Cache-Control",
      "no-cache, no-transform"
    );

    res.setHeader(
      "Connection",
      "keep-alive"
    );

    // Hạn chế proxy Nginx gom dữ liệu trước khi chuyển đến Frontend.
    res.setHeader(
      "X-Accel-Buffering",
      "no"
    );

    // Gửi các header ngay để bắt đầu truyền phản hồi theo luồng.
    res.flushHeaders();

    // Lưu các bước phản hồi hoàn chỉnh dần trong quá trình nhận dữ liệu từ Gemini.
    const generatedSteps = [];

    // Tích lũy toàn bộ nội dung trả lời để lưu vào lịch sử hội thoại.
    let assistantResponse = "";

    // Đánh dấu xem Gemini đã kết thúc tương tác thành công hay chưa.
    let streamCompleted = false;

    // Đọc lần lượt các sự kiện do Gemini trả về.
    for await (const event of stream) {

      // Khi một bước mới bắt đầu, sao chép dữ liệu ban đầu vào danh sách kết quả.
      if (event.event_type === "step.start") {
        generatedSteps[event.index] =
          structuredClone(event.step);

        continue;
      }

      // Xử lý phần dữ liệu bổ sung của một bước đang được tạo.
      if (event.event_type === "step.delta") {
        const currentStep =
          generatedSteps[event.index];

        // Báo lỗi nếu dữ liệu bổ sung tham chiếu đến bước chưa được khởi tạo.
        if (!currentStep) {
          throw new Error(
            `Received delta for unknown step index ${event.index}`
          );
        }

        // Cập nhật nội dung của bước theo loại dữ liệu vừa nhận.
        applyDeltaToStep(
          currentStep,
          event.delta
        );

        // Chỉ chuyển phần văn bản của model_output đến Frontend.
        // Các bước suy luận hoặc dữ liệu nội bộ khác không được hiển thị trong giao diện.
        if (
          currentStep.type === "model_output" &&
          event.delta.type === "text"
        ) {
          assistantResponse += event.delta.text;

          sendStreamEvent(res, {
            type: "text_delta",
            text: event.delta.text
          });
        }

        continue;
      }

      // Dừng xử lý nếu Gemini phát sinh sự kiện lỗi trong quá trình truyền dữ liệu.
      if (event.event_type === "error") {
        throw new Error(
          event.error?.message ||
          "Gemini streaming error"
        );
      }

      // Xác nhận trạng thái khi Gemini thông báo tương tác đã kết thúc.
      if (event.event_type === "interaction.completed") {
        if (event.interaction.status !== "completed") {
          throw new Error(
            `Gemini interaction ended with status: ${event.interaction.status}`
          );
        }

        streamCompleted = true;
      }
    }

    // Không chấp nhận kết quả nếu luồng dữ liệu kết thúc mà chưa xác nhận hoàn tất.
    if (!streamCompleted) {
      throw new Error(
        "Gemini stream ended before completion"
      );
    }

    // Loại bỏ các vị trí chưa có bước phản hồi trong mảng kết quả.
    const completedSteps =
      generatedSteps.filter(Boolean);

    // Không lưu câu trả lời nếu Gemini không tạo ra nội dung văn bản có ý nghĩa.
    if (!assistantResponse.trim()) {
      throw new Error(
        "Gemini returned an empty response"
      );
    }

    // Xác định đây có phải tin nhắn đầu tiên của hội thoại hay không.
    const isFirstMessage =
      conversation.messages.length === 0;

    // Lưu câu hỏi và các bước phản hồi của Gemini vào lịch sử dùng để tiếp tục hội thoại.
    // Sử dụng storedUserStep thay vì geminiUserStep để tránh lưu URI PDF có thể hết hạn.
    conversation.geminiHistory.push(
      storedUserStep,
      ...completedSteps
    );

    // Lưu câu hỏi và câu trả lời theo định dạng phục vụ hiển thị trên giao diện.
    conversation.messages.push(
      {
        role: "user",
        content: message.trim()
      },
      {
        role: "assistant",
        content: assistantResponse
      }
    );

    // Chỉ tạo tiêu đề từ câu hỏi đầu tiên nếu hội thoại không gắn với tài liệu PDF.
    // Với hội thoại PDF, giữ tiêu đề hiện có để tiếp tục sử dụng tên tài liệu.
    if (
      isFirstMessage &&
      !conversation.documentId
    ) {
      const cleanedTitle = message
        .trim()
        .replace(/\s+/g, " ");

      // Giới hạn tiêu đề ở 50 ký tự để giao diện hiển thị gọn hơn.
      conversation.title =
        cleanedTitle.length > 50
          ? `${cleanedTitle.slice(0, 50)}...`
          : cleanedTitle;
    }

    // Ghi lịch sử hội thoại và các tin nhắn mới vào MongoDB.
    await conversation.save();

    // Thông báo cho Frontend biết phản hồi đã hoàn tất.
    sendStreamEvent(res, {
      type: "done"
    });

    return res.end();

  } catch (error) {
    
    console.error(
      "generateChatCompletion error:",
      error
    );

    const status =
      error.status ||
      error.statusCode;

    let message =
      "Đã xảy ra lỗi khi xử lý yêu cầu.";

    let statusCode = 500;

    if (status === 429) {
      statusCode = 429;
      message =
        "Hệ thống AI đang nhận quá nhiều yêu cầu. Vui lòng thử lại sau ít phút.";
    } else if (status === 503) {
      statusCode = 503;
      message =
        "Dịch vụ AI hiện đang quá tải. Vui lòng thử lại sau.";
    }

    // Nếu phản hồi chưa bắt đầu, trả lỗi HTTP thông thường cho Frontend.
    if (!res.headersSent) {
      return res.status(statusCode).json({
        message
      });
    }

    // Nếu luồng đã bắt đầu, gửi sự kiện lỗi theo định dạng NDJSON.
    sendStreamEvent(res, {
      type: "error",
      message
    });

    return res.end();
  }
};