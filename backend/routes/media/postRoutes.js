import express from "express";
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

router.get("/", protect, getFeedPosts);
router.post("/create", protect, createPost);
router.delete("/delete/:id", protect, deletePost);
router.get("/:id", protect, getPostById);
router.post("/:id/comment", protect, createComment);
router.post("/:id/like", protect, likePost);

export default router;
