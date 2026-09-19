import mongoose from 'mongoose';
import User from "../models/User.js";
import Conversation from "../models/Conversation.js";
import { ai, geminiModel } from "../config/gemini-config.js";
import { STUDY_ASSISTANT_SYSTEM_INSTRUCTION } from "../utils/constants.js";
import { ensureGeminiFile } from '../lib/gemini-file-service.js';



function sendStreamEvent(res, event) {
  res.write(`${JSON.stringify(event)}\n`);
}

/**
 * Combines step.start and step.delta events into complete Gemini steps.
 *
 * This handles the steps currently expected from your text-only assistant:
 * - thought
 * - model_output
 *
 * Additional tool step reducers should be added here when you introduce tools.
 */
function applyDeltaToStep(step, delta) {
  if (delta.type === "text") {
    if (!step.content) {
      step.content = [];
    }

    let textContent = step.content.find(
      (item) => item.type === "text"
    );

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

  if (delta.type === "thought_signature") {
    step.signature = delta.signature;
    return;
  }

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

    if (
      !message ||
      typeof message !== "string" ||
      !message.trim()
    ) {
      return res.status(400).json({
        message: "Message is required"
      });
    }

    if (
      !conversationId ||
      !mongoose.isValidObjectId(conversationId)
    ) {
      return res.status(400).json({
        message: "Valid conversation ID is required"
      });
    }

    const userId = res.locals.jwtData.id;

    /*
     * Find the conversation AND verify that
     * it belongs to the currently logged-in user.
     */
    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId
    }).populate("documentId");

    if (!conversation.documentId) {
      return res.status(400).json({
        message:
          "This conversation does not have a PDF document"
      });
    }

    const document = await ensureGeminiFile(conversation.documentId);

    const documentInput = {
      type: "document",
      uri: document.geminiFileUri,
      mime_type: document.mimeType
    };

    const userStep = {
      type: "user_input",
      content: [
        {
          type: "text",
          text: message.trim()
        }
      ]
    };

    /*
     * Only this conversation's Gemini history
     * will be sent back to Gemini.
     */
    const requestHistory = [
      // Give Gemini the PDF first.
      documentInput,

      /*
       * Previous Gemini interaction
       * history for this conversation.
       */
      ...conversation.geminiHistory.map((step) => {
          if (typeof step.toObject === "function") {
            return step.toObject();
          }

          return step;
        }
      ),

      // Current user question
      userStep
    ];

    /*
     * This is basically your existing streaming code.
     */
    const stream = await ai.interactions.create({
      model: geminiModel,
      store: false,
      stream: true,
      input: requestHistory,
      system_instruction:
        STUDY_ASSISTANT_SYSTEM_INSTRUCTION
    });

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

    res.setHeader(
      "X-Accel-Buffering",
      "no"
    );

    res.flushHeaders();

    const generatedSteps = [];

    let assistantResponse = "";
    let streamCompleted = false;

    for await (const event of stream) {
      /*
       * STEP START
       */
      if (event.event_type === "step.start") {

        generatedSteps[event.index] =
          structuredClone(event.step);

        continue;

      }

      /*
       * STEP DELTA
       */
      if (event.event_type === "step.delta") {

        const currentStep =
          generatedSteps[event.index];


        if (!currentStep) {
          throw new Error(
            `Received delta for unknown step index ${event.index}`
          );
        }

        applyDeltaToStep(
          currentStep,
          event.delta
        );


        /*
         * Only model output is displayed.
         *
         * Thought steps are stored,
         * but never displayed.
         */
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


      /*
       * ERROR
       */
      if (event.event_type === "error") {

        throw new Error(
          event.error?.message ||
          "Gemini streaming error"
        );

      }


      /*
       * COMPLETED
       */
      if (
        event.event_type ===
        "interaction.completed"
      ) {

        if (
          event.interaction.status !==
          "completed"
        ) {

          throw new Error(
            `Gemini interaction ended with status: ${event.interaction.status}`
          );

        }


        streamCompleted = true;

      }

    }


    if (!streamCompleted) {

      throw new Error(
        "Gemini stream ended before completion"
      );

    }


    const completedSteps =
      generatedSteps.filter(Boolean);


    if (!assistantResponse.trim()) {

      throw new Error(
        "Gemini returned an empty response"
      );

    }


    /*
     * Check whether this was the first message.
     */
    const isFirstMessage =
      conversation.messages.length === 0;


    /*
     * Save Gemini history for THIS conversation.
     */
    conversation.geminiHistory.push(
      userStep,
      ...completedSteps
    );


    /*
     * Save UI messages for THIS conversation.
     */
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


    /*
     * Automatically use the first prompt as the title.
     */
    if (isFirstMessage) {

      const cleanedTitle =
        message.trim().replace(/\s+/g, " ");

      conversation.title =
        cleanedTitle.length > 50
          ? `${cleanedTitle.slice(0, 50)}...`
          : cleanedTitle;

    }


    await conversation.save();


    sendStreamEvent(res, {
      type: "done"
    });


    return res.end();

  } catch (error) {

    console.error(
      "generateChatCompletion error:",
      error
    );


    if (!res.headersSent) {

      return res.status(500).json({
        message:
          error instanceof Error
            ? error.message
            : "Unable to generate response"
      });

    }


    sendStreamEvent(res, {
      type: "error",

      message:
        error instanceof Error
          ? error.message
          : "Unable to generate response"
    });


    return res.end();

  }
};



export const sendChatsToUser = async (req, res, next) => {
  try {

    const user = await User.findById(res.locals.jwtData.id)

    if (!user) {
      return res.status(401).send('User not registered OR Token malfunctioned');
    }

    console.log(user)

    if (user._id.toString() !== res.locals.jwtData.id) {
      return res.status(401).send("Permission didn't match");
    }

    return res.status(201).json({
      message: 'OK',
      chats: user.chats
    })

  } catch (error) {

    console.log(error)
    return res.status(200).json({
      message: 'ERROR',
      cause: error instanceof Error ? error.message : String(error)
    });

  }
};



export const createConversation = async (req, res) => {
  try {

    const userId = res.locals.jwtData.id;

    const conversation = await Conversation.create({
      userId,
      documentId: document._id,
      title: document.fileName
    });

    return res.status(201).json({
      message: "OK",
      conversation: {
        _id: conversation._id,
        title: conversation.title,
        createdAt: conversation.createdAt,
        updatedAt: conversation.updatedAt
      }
    });

  } catch (error) {

    console.error("createConversation error:", error);

    return res.status(500).json({
      message: "Unable to create conversation"
    });

  }
};



export const getUserConversations = async (req, res) => {
  try {

    const userId = res.locals.jwtData.id;

    const conversations = await Conversation.find({
      userId
    })
      .select("_id title createdAt updatedAt")
      .sort({
        updatedAt: -1
      });

    return res.status(200).json({
      message: "OK",
      conversations
    });

  } catch (error) {

    console.error("getUserConversations error:", error);

    return res.status(500).json({
      message: "Unable to retrieve conversations"
    });

  }
};



export const getConversation = async (req, res) => {
  try {

    const userId = res.locals.jwtData.id;

    const { conversationId } = req.params;


    if (!mongoose.isValidObjectId(conversationId)) {
      return res.status(400).json({
        message: "Invalid conversation ID"
      });
    }


    const conversation = await Conversation.findOne({
      _id: conversationId,
      userId
    }).select(
      "_id title messages createdAt updatedAt"
    );


    if (!conversation) {
      return res.status(404).json({
        message: "Conversation not found"
      });
    }


    return res.status(200).json({
      message: "OK",
      conversation
    });

  } catch (error) {

    console.error("getConversation error:", error);

    return res.status(500).json({
      message: "Unable to retrieve conversation"
    });

  }
};



export const deleteConversation = async (req, res) => {
  try {

    const userId = res.locals.jwtData.id;
    const { conversationId } = req.params;


    if (!mongoose.isValidObjectId(conversationId)) {
      return res.status(400).json({
        message: "Invalid conversation ID"
      });
    }


    const deletedConversation =
      await Conversation.findOneAndDelete({
        _id: conversationId,
        userId
      });


    if (!deletedConversation) {
      return res.status(404).json({
        message: "Conversation not found"
      });
    }


    return res.status(200).json({
      message: "OK"
    });

  } catch (error) {

    console.error("deleteConversation error:", error);

    return res.status(500).json({
      message: "Unable to delete conversation"
    });

  }
};