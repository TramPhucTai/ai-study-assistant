import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";



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


    const deletedConversation =
      await Conversation
        .findOneAndDelete({
          _id:
            conversationId,

          userId
        });


    if (!deletedConversation) {

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

        message: "OK"

      });

  } catch (error) {

    console.error(
      "deleteConversation error:",
      error
    );


    return res
      .status(500)
      .json({

        message:
          "Unable to delete conversation"

      });

  }

};