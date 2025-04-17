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
  searchPosts,
  updatePost,
} from "../../controllers/media/postController.js";

const router = express.Router();

router.get("/search", trimRequest.all, protect, searchPosts);
router.get("/", trimRequest.all, protect, getFeedPosts);
router.post("/create", trimRequest.all, protect, createPost);
router.delete("/delete/:id", protect, deletePost);
router.get("/:id", trimRequest.all, protect, getPostById);
router.post("/:id/comment", trimRequest.all, protect, createComment);
router.post("/:id/like", trimRequest.all, protect, likePost);
router.put("/update/:id", trimRequest.all, protect, updatePost);

export default router;
