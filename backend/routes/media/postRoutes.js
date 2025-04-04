import express from "express";
import trimRequest from "trim-request";

import {
  protect,
  adminOnly,
  authorOnly,
} from "../../middlewares/authMiddleware.js";
import {
  createComment,
  createPost,
  deletePost,
  getFeedPosts,
  getPostById,
  likePost,
} from "../../controllers/media/postController.js";

const router = express.Router();

router.get("/", trimRequest.all, protect, getFeedPosts);
router.post("/create", trimRequest.all, protect, createPost);
router.delete("/delete/:id", protect, deletePost);
router.get("/:id", trimRequest.all, protect, getPostById);
router.post("/:id/comment", trimRequest.all, protect, createComment);
router.post("/:id/like", trimRequest.all, protect, likePost);

export default router;
