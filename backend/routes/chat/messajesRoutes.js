import express from "express";
import trimRequest from "trim-request";
import { protect } from "../../middlewares/authMiddleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../../controllers/chat/messageController.js";

const router = express.Router();

router.get("/users", trimRequest.all, protect, getUsersForSidebar);
router.get("/:id", trimRequest.all, protect, getMessages);

router.post("/send/:id", trimRequest.all, protect, sendMessage);

export default router;
