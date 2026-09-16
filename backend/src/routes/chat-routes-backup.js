import { Router } from "express";
import { verifyToken } from '../utils/token-manager.js'
import { chatCompletionValidator, validate } from "../utils/validators.js";
import { createConversation, getUserConversations, getConversation, deleteConversation, generateChatCompletion } from "../controllers/chat-controllers.js";



// Protected API, only the authenticated users can access
const chatRoutes = Router();

chatRoutes.post(
  "/conversations",
  verifyToken,
  createConversation
);

chatRoutes.get(
  "/conversations",
  verifyToken,
  getUserConversations
);

chatRoutes.get(
  "/conversations/:conversationId",
  verifyToken,
  getConversation
);

chatRoutes.delete(
  "/conversations/:conversationId",
  verifyToken,
  deleteConversation
);

chatRoutes.post(
  "/new",
  verifyToken,
  validate(chatCompletionValidator),
  generateChatCompletion
);

export default chatRoutes;