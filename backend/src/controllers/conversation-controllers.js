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

      // 1. Validate conversation ID
      if (!mongoose.isValidObjectId(conversationId)) {
        return res.status(400)
          .json({
            message: "Invalid conversation ID"
          });
      }

      // 2. Find conversation first
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

      // 3. Find associated document
      let document = null;

      if (conversation.documentId) {
        document =
          await Document.findOne({
            _id:
              conversation.documentId,

            userId
          });
      }

      // 4. Delete PDF from S3
      if (document?.s3Key) {
        await deleteFileFromS3(
          document.s3Key
        );
      }

      // 5. Delete temporary Gemini file
      if (document?.geminiFileName) {
        await deleteGeminiFile(
          document.geminiFileName
        );

      }

      // 6. Delete Document from MongoDB
      if (document) {
        await Document.deleteOne({
          _id: document._id,
          userId
        });

      }

      // 7. Delete Conversation
      // messages and geminiHistory
      // are embedded inside Conversation,
      // so they are removed automatically.
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