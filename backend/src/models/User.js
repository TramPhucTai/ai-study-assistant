import mongoose from "mongoose";
import { randomUUID } from "crypto";

const chatSchema = new mongoose.Schema({

  id: {
    type: String,
    default: randomUUID()
  },

  role: {
    type: String,
    required: true,
  },

  content: {
    type: String,
    required: true,
  }

});

// Store Gemini interaction steps exactly as returned
const geminiStepSchema = new mongoose.Schema(
  {},
  {
    strict: false,
    _id: false
  }
);

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
    unique: true,
  },

  password: {
    type: String,
    required: true,
  },

  chats: [chatSchema],
  
  // Used to send conversation context back to Gemini
  geminiHistory: [geminiStepSchema]

});

export default mongoose.model('User', userSchema);