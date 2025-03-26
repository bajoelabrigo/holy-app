import express from "express";
import {
  protect,
  adminOnly,
  authorOnly,
} from "../../middlewares/authMiddleware.js";
import { deleteNotification, getUserNotifications, markNotificationAsRead } from "../../controllers/media/notificationController.js";

const router = express.Router();

router.get("/", protect, getUserNotifications);

router.put("/:id/read", protect, markNotificationAsRead);
router.delete("/:id", protect, deleteNotification);

export default router;
