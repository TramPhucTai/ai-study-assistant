import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";
import Document from "../models/Document.js";
import { deleteFileFromS3 } from "../services/s3.js";
import { deleteGeminiFile } from "../services/gemini-file-service.js";



export const createConversation =
  async (req, res) => {

    try {

      const userId =
        res.locals.jwtData.id;

      const conversation =
        await Conversation.create({
          userId,
          title:
            "Cuộc trò chuyện mới"
        });

      return res
        .status(201)
        .json({

          message: "OK",

          conversation: {
            _id:
              conversation._id,

            title:
              conversation.title,

            createdAt:
              conversation.createdAt,

            updatedAt:
              conversation.updatedAt
          }

        });

    } catch (error) {

      console.error(
        "createConversation error:",
        error
      );

      return res
        .status(500)
        .json({

          message:
            "Unable to create conversation"

        });

    }

  };

export const getUserConversations =
  async (req, res) => {

    try {

      const userId =
        res.locals.jwtData.id;

      const conversations =
        await Conversation
          .find({
            userId
          })
          .select(
            "_id title documentId createdAt updatedAt"
          )
          .sort({
            updatedAt: -1
          });

      return res
        .status(200)
        .json({

          message: "OK",

          conversations

        });

    } catch (error) {

      console.error(
        "getUserConversations error:",
        error
      );

      return res
        .status(500)
        .json({

          message:
            "Unable to retrieve conversations"

        });

    }

  };

export const getConversation =
  async (req, res) => {

    try {

      const userId =
        res.locals.jwtData.id;

      const {
        conversationId
      } = req.params;

      // Kiểm tra mã hội thoại có đúng định dạng ObjectId của MongoDB hay không
      if (
        !mongoose.isValidObjectId(
          conversationId
        )
      ) {

        return res
          .status(400)
          .json({

            message:
              "Invalid conversation ID"

          });

      }

      // Chỉ truy xuất hội thoại thuộc về người dùng đang đăng nhập
      const conversation =
        await Conversation.findOne({
          _id: conversationId,
          userId
        })
          .select(
            "_id title documentId messages createdAt updatedAt"
          );

      if (!conversation) {

        return res
          .status(404)
          .json({

            message:
              "Conversation not found"

          });

      }

      return res
        .status(200)
        .json({

          message: "OK",

          conversation

        });

    } catch (error) {

      console.error(
        "getConversation error:",
        error
      );

      return res
        .status(500)
        .json({

          message:
            "Unable to retrieve conversation"

        });

    }

  };

export const deleteConversation =
  async (req, res) => {

    try {

      const userId = res.locals.jwtData.id;

      const { conversationId } = req.params;

      // Kiểm tra tính hợp lệ của mã hội thoại trước khi thực hiện xóa
      if (!mongoose.isValidObjectId(conversationId)) {
        return res.status(400)
          .json({
            message: "Invalid conversation ID"
          });
      }

      // Tìm hội thoại thuộc người dùng hiện tại trước khi xóa
      const conversation =
        await Conversation.findOne({
          _id: conversationId,
          userId
        });

      if (!conversation) {
        return res.status(404)
          .json({
            message: "Conversation not found"
          });
      }

      // Tìm tài liệu PDF liên kết với hội thoại
      let document = null;

      if (conversation.documentId) {
        document =
          await Document.findOne({
            _id:
              conversation.documentId,

            userId
          });
      }

      // Xóa tệp PDF đã lưu trên Amazon S3 nếu tài liệu có khóa lưu trữ
      if (document?.s3Key) {
        await deleteFileFromS3(
          document.s3Key
        );
      }

      // Xóa tệp tạm đã tải lên Gemini nếu có thông tin tệp
      if (document?.geminiFileName) {
        await deleteGeminiFile(
          document.geminiFileName
        );

      }

      // Xóa bản ghi tài liệu khỏi cơ sở dữ liệu MongoDB
      if (document) {
        await Document.deleteOne({
          _id: document._id,
          userId
        });

      }

      // Xóa hội thoại; messages và geminiHistory được lưu trực tiếp
      // trong bản ghi hội thoại nên sẽ bị xóa cùng bản ghi này
      await Conversation.deleteOne({
        _id: conversation._id,
        userId
      });

      return res.status(200)
        .json({
          message: "Conversation and document deleted successfully"
        });

    } catch (error) {

      console.error("deleteConversation error:", error);

      return res.status(500)
        .json({
          message:
            error instanceof Error
              ? error.message
              : "Unable to delete conversation"
        });
    }
  };