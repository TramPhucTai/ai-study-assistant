import User from "../models/User.js";
import { ai, geminiModel } from "../config/gemini-config.js";
import { STUDY_ASSISTANT_SYSTEM_INSTRUCTION } from "../utils/constants.js";



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
  let user;

  try {

    const { message } = req.body;

    if (!message || typeof message !== "string" || !message.trim()) {
      return res.status(400).json({
        message: "Message is required"
      });
    }

    user = await User.findById(res.locals.jwtData.id);

    console.log("User found:", user ? user._id : "NO USER");

    if (!user) {
      return res.status(401).json({
        message: 'User not registered OR Token malfunctioned'
      })
    }

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
     * Do not modify the database history yet.
     * If Gemini fails halfway through, incomplete history should not be saved.
     */
    const requestHistory = [
      ...user.geminiHistory.map((step) => step.toObject()),
      userStep
    ];

    const stream = await ai.interactions.create({
      model: geminiModel,
      store: false,
      stream: true,
      input: requestHistory,
      system_instruction: STUDY_ASSISTANT_SYSTEM_INSTRUCTION
    });

    /*
     * The request has been accepted by Gemini, so streaming can begin.
     * Each response line is one JSON object (NDJSON).
     */
    res.status(200);
    res.setHeader(
      "Content-Type",
      "application/x-ndjson; charset=utf-8"
    );
    res.setHeader("Cache-Control", "no-cache, no-transform");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("X-Accel-Buffering", "no");

    res.flushHeaders();

    const generatedSteps = [];
    let assistantResponse = "";
    let streamCompleted = false;

    for await (const event of stream) {
      if (event.event_type === "step.start") {
        /*
         * Clone the step so we can safely add accumulated deltas.
         * event.index identifies which step the delta belongs to.
         */
        generatedSteps[event.index] = structuredClone(event.step);
        continue;
      }

      if (event.event_type === "step.delta") {
        const currentStep = generatedSteps[event.index];

        if (!currentStep) {
          throw new Error(
            `Received delta for unknown step index ${event.index}`
          );
        }

        applyDeltaToStep(currentStep, event.delta);

        /*
         * Only model-output text should be shown in the chat.
         * Thought signatures must be saved, not displayed.
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

      if (event.event_type === "error") {
        throw new Error(
          event.error?.message || "Gemini streaming error"
        );
      }

      if (event.event_type === "interaction.completed") {
        if (event.interaction.status !== "completed") {
          throw new Error(
            `Gemini interaction ended with status: ${event.interaction.status}`
          );
        }

        streamCompleted = true;
      }
    }

    if (!streamCompleted) {
      throw new Error("Gemini stream ended before completion");
    }

    const completedSteps = generatedSteps.filter(Boolean);

    if (!assistantResponse.trim()) {
      throw new Error("Gemini returned an empty response");
    }

    /*
     * Save the user step and every reconstructed model step in order.
     * This preserves thought signatures needed by later stateless requests.
     */
    user.geminiHistory.push(userStep, ...completedSteps);

    user.chats.push(
      {
        role: "user",
        content: message.trim()
      },
      {
        role: "assistant",
        content: assistantResponse
      }
    );

    await user.save();

    sendStreamEvent(res, {
      type: "done"
    });

    res.end();

  } catch (error) {
    console.error("generateChatCompletion error:", error);

    if (!res.headersSent) {
      return res.status(500).json({
        message: error instanceof Error
          ? error.message
          : "Unable to generate response"
      });
    }

    sendStreamEvent(res, {
      type: "error",
      message: error instanceof Error
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