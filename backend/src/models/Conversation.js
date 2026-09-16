import mongoose from "mongoose";
import { randomUUID } from "crypto";


const messageSchema = new mongoose.Schema(
  {
    id: {
      type: String,
      default: randomUUID
    },

    role: {
      type: String,
      enum: ["user", "assistant"],
      required: true
    },

    content: {
      type: String,
      required: true
    }
  },
  {
    _id: false
  }
);


const geminiStepSchema = new mongoose.Schema(
  {},
  {
    strict: false,
    _id: false
  }
);


const conversationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true
    },

    title: {
      type: String,
      default: "Cuộc trò chuyện mới",
      trim: true
    },

    messages: {
      type: [messageSchema],
      default: []
    },

    geminiHistory: {
      type: [geminiStepSchema],
      default: []
    },

    // You can use this later when PDF support is completed
    documentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Document",
      default: null
    }
  },
  {
    timestamps: true
  }
);


export default mongoose.model("Conversation", conversationSchema);