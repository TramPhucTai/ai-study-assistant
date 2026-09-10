import User from "../models/User.js";
import { ai, geminiModel } from "../config/gemini-config.js";
import { STUDY_ASSISTANT_SYSTEM_INSTRUCTION } from "../utils/constants.js";



export const generateChatCompletion = async (req, res, next) => {

  try {

    const { message } = req.body;

    console.log("Message:", message);

    const user = await User.findById(res.locals.jwtData.id);

    console.log("User found:", user ? user._id : "NO USER");

    if (!user) {
      return res.status(401).json({
        message: 'User not registered OR Token malfunctioned'
      })
    }

    // 1. Create new Gemini user step
    const userStep = {
      type: "user_input",
      content: [
        {
          type: "text",
          text: message
        }
      ]
    };

    // 2. Add it to Gemini history
    user.geminiHistory.push(userStep);

    // Debug
    console.log(
      "Gemini history before request:",
      JSON.stringify(user.geminiHistory, null, 2)
    );

    // 3. Send full history to Gemini
    const interaction = await ai.interactions.create({
      model: geminiModel,
      store: false,
      input: user.geminiHistory,
      system_instruction: STUDY_ASSISTANT_SYSTEM_INSTRUCTION
    });

    // Debug
    console.log(
      "Gemini interaction:",
      interaction
    );

    // 4. Get text response
    const response = interaction.output_text;

    // 5. Save Gemini-generated steps exactly as returned
    user.geminiHistory.push(
      ...interaction.steps
    );

    // 6. Save simple messages for frontend
    user.chats.push({
      role: "user",
      content: message
    });

    user.chats.push({
      role: "assistant",
      content: response
    });

    // 7. Save everything
    await user.save();

    return res.status(200).json({
      chats: user.chats
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

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