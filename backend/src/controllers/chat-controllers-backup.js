import User from "../models/User.js";
import { ai } from "../config/gemini-config.js";



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

    // Get previous chats from MongoDB
    const chats = user.chats.map(({ role, content }) => ({
      role,
      content
    }));

    // Debug
    console.log("Previous chats:", JSON.stringify(chats, null, 2));

    // Add the new user message to the conversation
    chats.push({
      role: "user",
      content: message
    });

    // Debug
    console.log(
      "Chats sent to Gemini:",
      JSON.stringify(chats, null, 2)
    );

    // Save the user's message
    user.chats.push({
      role: "user",
      content: message
    });

    // Send prompt to Gemini
    const interaction = await ai.interactions.create({
      model: "gemini-3.8-flash",
      input: message
    });

    // Debug
    console.log("Gemini interaction:", interaction);

    // Get Gemini's response
    const response = interaction.output_text;

    // Save Gemini's response
    user.chats.push({
      role: "assistant",
      content: response
    });

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