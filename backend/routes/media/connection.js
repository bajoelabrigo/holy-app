import express from "express";
import trimRequest from "trim-request";

import {
  protect,
  adminOnly,
  authorOnly,
} from "../../middlewares/authMiddleware.js";
import {
  acceptConnectionRequest,
  getConnectionRequests,
  getConnectionStatus,
  getUserConnections,
  rejectConnectionRequest,
  removeConnection,
  sendConnectionRequest,
} from "../../controllers/media/connectionController.js";

const router = express.Router();

router.post(
  "/request/:userId",
  trimRequest.all,
  protect,
  sendConnectionRequest
);
router.put(
  "/accept/:requestId",
  trimRequest.all,
  protect,
  acceptConnectionRequest
);
router.put(
  "/reject/:requestId",
  trimRequest.all,
  protect,
  rejectConnectionRequest
);

// Get all connection requests for the current user
router.get("/request", trimRequest.all, protect, getConnectionRequests);
// Get all connections for a user
router.get("/", trimRequest.all, protect, getUserConnections);
router.delete("/:userId", trimRequest.all, protect, removeConnection);
router.get("/status/:userId", trimRequest.all, protect, getConnectionStatus);

export default router;
