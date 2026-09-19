import mongoose from "mongoose";
import Conversation from "../models/Conversation.js";
import Document from "../models/Document.js";
import { ai, geminiModel } from "../config/gemini-config.js";
import { STUDY_ASSISTANT_SYSTEM_INSTRUCTION } from "../utils/constants.js";
import { attachPdfToGemini } from "../lib/gemini-file-service.js";
import { ensureGeminiFile } from "../lib/gemini-file-service.js";



function sendStreamEvent(res, event) {
  res.write(`${JSON.stringify(event)}\n`);
}

function applyDeltaToStep(step, delta) {
  if (delta.type === "text") {

    if (!step.content) {
      step.content = [];
    }


    let textContent =
      step.content.find(
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

    step.signature =
      delta.signature;

    return;

  }


  if (delta.type === "thought_summary") {

    if (!step.summary) {
      step.summary = [];
    }


    if (delta.content) {
      step.summary.push(
        delta.content
      );
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


    const userId =
      res.locals.jwtData.id;


    /*
     * 1. Find conversation
     */
    const conversation =
      await Conversation.findOne({
        _id: conversationId,
        userId
      });


    if (!conversation) {

      return res.status(404).json({
        message: "Conversation not found"
      });

    }


    /*
     * 2. Make sure this conversation
     * actually has a PDF attached.
     */
    if (!conversation.documentId) {

      return res.status(400).json({
        message:
          "This conversation does not have a PDF document attached"
      });

    }


    /*
     * 3. Get the Document belonging
     * to the current user.
     */
    let document =
      await Document.findOne({
        _id: conversation.documentId,
        userId
      });


    if (!document) {

      return res.status(404).json({
        message:
          "PDF document not found"
      });

    }

    /*
    * Make sure Gemini still has
    * a valid copy of the PDF.
    *
    * If the old Gemini file expired,
    * ensureGeminiFile() uploads it
    * again from S3.
    */
    document = await ensureGeminiFile(document);

    /*
     * 4. Check whether the Gemini file
     * is missing or expired.
     *
     * Use a small safety margin so that
     * we don't use a file that's about
     * to expire during the request.
     */
    const fiveMinutes =
      5 * 60 * 1000;

    const geminiFileExpired =
      !document.geminiFileUri ||
      !document.geminiExpirationTime ||
      new Date(
        document.geminiExpirationTime
      ).getTime() <=
      Date.now() + fiveMinutes;


    /*
     * 5. If Gemini no longer has the
     * PDF, upload it again from S3.
     */
    if (geminiFileExpired) {

      document =
        await attachPdfToGemini(
          document
        );

    }


    if (!document.geminiFileUri) {

      throw new Error(
        "Unable to obtain Gemini file URI"
      );

    }


    /*
     * 6. This is the version of the
     * user step that will be STORED.
     *
     * Notice that it contains text only.
     *
     * We intentionally do NOT save the
     * Gemini document URI because Gemini
     * file URIs expire.
     */
    const storedUserStep = {

      type: "user_input",

      content: [
        {
          type: "text",
          text: message.trim()
        }
      ]

    };


    /*
     * 7. This is the version sent to
     * Gemini.
     *
     * It contains BOTH:
     *
     * - the user's question
     * - the PDF document
     */
    const geminiUserStep = {

      type: "user_input",

      content: [

        {
          type: "text",
          text: message.trim()
        },

        {
          type: "document",
          uri:
            document.geminiFileUri,

          mime_type:
            document.mimeType ||
            "application/pdf"
        }

      ]

    };


    /*
     * 8. Build Gemini conversation
     * history.
     */
    const requestHistory = [

      ...conversation.geminiHistory.map(
        (step) => {

          if (
            typeof step.toObject ===
            "function"
          ) {

            return step.toObject();

          }

          return step;

        }
      ),

      geminiUserStep

    ];


    /*
     * 9. Send conversation history +
     * PDF + current prompt to Gemini.
     */
    const stream =
      await ai.interactions.create({

        model:
          geminiModel,

        store:
          false,

        stream:
          true,

        input:
          requestHistory,

        system_instruction:
          STUDY_ASSISTANT_SYSTEM_INSTRUCTION

      });


    /*
     * 10. Configure streaming response
     */
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


    /*
     * 11. Read Gemini stream
     */
    for await (const event of stream) {

      /*
       * STEP START
       */
      if (
        event.event_type ===
        "step.start"
      ) {

        generatedSteps[
          event.index
        ] =
          structuredClone(
            event.step
          );

        continue;

      }


      /*
       * STEP DELTA
       */
      if (
        event.event_type ===
        "step.delta"
      ) {

        const currentStep =
          generatedSteps[
          event.index
          ];


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
         * Show only final model text.
         *
         * Thought/reasoning steps remain
         * hidden from the frontend.
         */
        if (
          currentStep.type ===
          "model_output" &&
          event.delta.type ===
          "text"
        ) {

          assistantResponse +=
            event.delta.text;


          sendStreamEvent(
            res,
            {
              type:
                "text_delta",

              text:
                event.delta.text
            }
          );

        }


        continue;

      }


      /*
       * ERROR
       */
      if (
        event.event_type ===
        "error"
      ) {

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


    if (
      !assistantResponse.trim()
    ) {

      throw new Error(
        "Gemini returned an empty response"
      );

    }


    const isFirstMessage =
      conversation.messages.length === 0;


    /*
     * 12. Save conversation history.
     *
     * IMPORTANT:
     *
     * Store storedUserStep,
     * NOT geminiUserStep.
     *
     * Otherwise an expired Gemini file URI
     * would become permanently stored
     * in the conversation history.
     */
    conversation.geminiHistory.push(
      storedUserStep,
      ...completedSteps
    );


    /*
     * 13. Save frontend/UI messages.
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
     * Since PDF conversations already
     * use the filename as their title,
     * I recommend NOT replacing the title
     * with the first prompt.
     *
     * Only rename text-only conversations.
     */
    if (
      isFirstMessage &&
      !conversation.documentId
    ) {

      const cleanedTitle =
        message
          .trim()
          .replace(/\s+/g, " ");


      conversation.title =
        cleanedTitle.length > 50
          ? `${cleanedTitle.slice(
            0,
            50
          )}...`
          : cleanedTitle;

    }


    await conversation.save();


    sendStreamEvent(
      res,
      {
        type: "done"
      }
    );


    return res.end();

  } catch (error) {

    console.error(
      "generateChatCompletion error:",
      error
    );


    if (!res.headersSent) {

      return res
        .status(500)
        .json({

          message:
            error instanceof Error
              ? error.message
              : "Unable to generate response"

        });

    }


    sendStreamEvent(
      res,
      {

        type: "error",

        message:
          error instanceof Error
            ? error.message
            : "Unable to generate response"

      }
    );


    return res.end();

  }
};