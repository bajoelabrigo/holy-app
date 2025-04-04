import express from "express";
import trimRequest from "trim-request";

import {
  protect,
  adminOnly,
  authorOnly,
} from "../../middlewares/authMiddleware.js";
import {
  deleteNotification,
  getUserNotifications,
  markNotificationAsRead,
} from "../../controllers/media/notificationController.js";

const router = express.Router();

router.get("/", trimRequest.all, protect, getUserNotifications);

router.put("/:id/read", trimRequest.all, protect, markNotificationAsRead);
router.delete("/:id", trimRequest.all, protect, deleteNotification);

export default router;
