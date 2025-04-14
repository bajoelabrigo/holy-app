import express from "express";
import trimRequest from "trim-request";
import { protect } from "../../middlewares/authMiddleware.js";
import {
  createGroupChat,
  createOneToOneConversation,
  deleteMessage,
  editMessage,
  getMessages,
  getUsersForSidebar,
  sendMessage,
} from "../../controllers/chat/messageController.js";

import { getUserConversations } from "../../controllers/chat/getUserConversations.js";

const router = express.Router();

router.get("/users", trimRequest.all, protect, getUsersForSidebar);

router.get("/conversations", trimRequest.all, protect, getUserConversations);

router.get("/:id", trimRequest.all, protect, getMessages);

router.post("/send/:id", trimRequest.all, protect, sendMessage);

// Crear grupo
router.post("/group", trimRequest.all, protect, createGroupChat);

// Editar mensaje enviado
router.put("/message/:messageId", trimRequest.all, protect, editMessage);

// Eliminar mensaje enviado
router.delete("/message/:messageId", trimRequest.all, protect, deleteMessage);

// POST /messages/conversation/:receiverId
router.post("/conversation/:receiverId", protect, createOneToOneConversation);

export default router;
