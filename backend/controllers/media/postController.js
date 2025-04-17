import cloudinary from "../../lib/cloudinary.js";
import Post from "../../models/media/postModel.js";
import Notification from "../../models/media/notificationModel.js";
import User from "../../models/userModel.js";
import { io } from "../../lib/socket.js";

export const getFeedPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const skip = (page - 1) * limit;

    let query;

    if (req.user.role === "admin") {
      query = {};
    } else {
      const adminIds = await getAdminUserIds();
      query = {
        author: {
          $in: [...req.user.connections, req.user._id, ...adminIds],
        },
      };
    }

    const posts = await Post.find(query)
      .populate("author", "name username profilePicture headline")
      .populate("comments.user", "name profilePicture")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json(posts); // 👈 debe ser un array plano
  } catch (error) {
    console.error("Error in getFeedPosts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// Utilidad para encontrar IDs de usuarios admin
const getAdminUserIds = async () => {
  const admins = await User.find({ role: "admin" }).select("_id");
  return admins.map((admin) => admin._id);
};

export const createPost = async (req, res) => {
  try {
    const { content, image } = req.body;

    const newPost = new Post({
      author: req.user._id,
      content,
      image,
    });

    await newPost.save();

    const populatedPost = await newPost.populate(
      "author",
      "name username profilePicture headline"
    );

    // 🔴 Emitir evento con socket.io
    io.emit("newPost", populatedPost); // <--- todos los usuarios recibirán esto

    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error in createPost controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const deletePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (
      post.author.toString() !== userId.toString() &&
      req.user.role !== "admin" &&
      req.user.role !== "moderator"
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to delete this post" });
    }

    if (post.image) {
      await cloudinary.uploader.destroy(
        post.image.split("/").pop().split(".")[0]
      );
    }

    await Post.findByIdAndDelete(postId);

    res.status(200).json({ message: "Post deleted successfully" });
  } catch (error) {
    console.log("Error in delete post controller", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export const getPostById = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId)
      .populate("author", "name username profilePicture headline")
      .populate("comments.user", "name profilePicture username headline");

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error in getPostById controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const createComment = async (req, res) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;

    const post = await Post.findByIdAndUpdate(
      postId,
      {
        $push: { comments: { user: req.user._id, content } },
      },
      { new: true }
    ).populate("author", "name email username headline profilePicture");

    if (post.author._id.toString() !== req.user._id.toString()) {
      const newNotification = new Notification({
        recipient: post.author,
        type: "comment",
        relatedUser: req.user._id,
        relatedPost: postId,
      });

      await newNotification.save();
    }

    res.status(200).json(post);
  } catch (error) {
    console.error("Error in createComment controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const likePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    const userId = req.user._id;

    if (post.likes.includes(userId)) {
      post.likes = post.likes.filter(
        (id) => id.toString() !== userId.toString()
      );
    } else {
      post.likes.push(userId);
      if (post.author.toString() !== userId.toString()) {
        const newNotification = new Notification({
          recipient: post.author,
          type: "like",
          relatedUser: userId,
          relatedPost: postId,
        });

        await newNotification.save();
      }
    }

    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error("Error in likePost controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

export const updatePost = async (req, res) => {
  try {
    const postId = req.params.id;
    const { content } = req.body;
    const userId = req.user._id;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // Permitir si es autor o admin
    if (
      post.author.toString() !== userId.toString() &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({
        message: "You are not authorized to update this post",
      });
    }

    post.content = content;
    await post.save();

    res.status(200).json(post);
  } catch (error) {
    console.error("Error in updatePost controller:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// GET /api/posts/search?query=palabra

export const searchPosts = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query || query.trim() === "") {
      return res.status(400).json({ message: "Consulta vacía" });
    }

    const regex = new RegExp(query, "i");

    const posts = await Post.find({
      $or: [{ content: regex }, { "comments.content": regex }],
    })
      .populate("author", "name username profilePicture")
      .sort({ createdAt: -1 });

    const filtered = posts.filter(
      (post) =>
        post.author?.name?.toLowerCase().includes(query.toLowerCase()) ||
        post.author?.username?.toLowerCase().includes(query.toLowerCase()) ||
        regex.test(post.content)
    );

    res.status(200).json(filtered);
  } catch (error) {
    console.error("Error en búsqueda:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
