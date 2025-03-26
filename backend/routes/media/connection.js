import express from "express";
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

router.post("/request/:userId", protect, sendConnectionRequest);
router.put("/accept/:requestId", protect, acceptConnectionRequest);
router.put("/reject/:requestId", protect, rejectConnectionRequest);

// Get all connection requests for the current user
router.get("/request", protect, getConnectionRequests);
// Get all connections for a user
router.get("/", protect, getUserConnections);
router.delete("/:userId", protect, removeConnection);
router.get("/status/:userId", protect, getConnectionStatus);

export default router;
