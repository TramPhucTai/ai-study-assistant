import { Router } from "express";
import { verifyToken } from '../utils/token-manager.js'
import { chatCompletionValidator, validate } from "../utils/validators.js";
import { generateChatCompletion } from "../controllers/chat-controllers.js";
import { createConversation, getUserConversations, getConversation, deleteConversation} from "../controllers/conversation-controllers.js";



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