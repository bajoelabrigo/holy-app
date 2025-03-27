import express from "express";
import trimRequest from "trim-request";
import { protect } from "../../middlewares/authMiddleware.js";
import { create_open_conversation, createGroup, getConversations } from "../../controllers/chat/conversationController.js";

const router = express.Router();

router.route("/").post(trimRequest.all, protect, create_open_conversation)

router.route("/").get(trimRequest.all, protect, getConversations)
router.route("/group").post(trimRequest.all, protect, createGroup)

export default router;
