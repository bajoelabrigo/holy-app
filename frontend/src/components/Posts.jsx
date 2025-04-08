import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { Link, useParams } from "react-router-dom";
import {
  Download,
  File,
  Loader,
  MessageCircle,
  Send,
  Share2,
  ThumbsUp,
  Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import Microlink from "@microlink/react";

import PostAction from "./PostAction";
import { useSelector } from "react-redux";
import Waveform from "./voice/WaveForm";
import extractLinks from "../utils/extraLinks";
import { confirmAlert } from "react-confirm-alert";
import 'react-confirm-alert/src/react-confirm-alert.css'; // Import css

const Post = ({ post }) => {
  const { postId } = useParams();

  const { user: authUser } = useSelector((state) => state.auth);

  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(post.comments || []);
  const isOwner = authUser?._id === post.author?._id;
  const isLiked = post.likes.includes(authUser?._id);

  const queryClient = useQueryClient();

  const { mutate: deletePost, isPending: isDeletingPost } = useMutation({
    mutationFn: async () => {
      await axiosInstance.delete(`/posts/delete/${post._id}`);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const { mutate: createComment, isPending: isAddingComment } = useMutation({
    mutationFn: async (newComment) => {
      await axiosInstance.post(`/posts/${post._id}/comment`, {
        content: newComment,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Comment added successfully");
    },
    onError: (err) => {
      toast.error(err.response.data.message || "Failed to add comment");
    },
  });

  const { mutate: likePost, isPending: isLikingPost } = useMutation({
    mutationFn: async () => {
      await axiosInstance.post(`/posts/${post._id}/like`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      queryClient.invalidateQueries({ queryKey: ["post", postId] });
    },
  });

  const handleDeletePost = () => {
    deletePost();
  };

  const confirmDelete = () => {
    confirmAlert({
      title: "Delete This User",
      message: "Are you sure to do delete this user?",
      buttons: [
        {
          label: "Delete",
          onClick: () => handleDeletePost(),
        },
        {
          label: "Cancel",
          onClick: () => alert("Click No"),
        },
      ],
    });
  };

  const handleLikePost = async () => {
    if (isLikingPost) return;
    likePost();
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      createComment(newComment);
      setNewComment("");
      setComments([
        ...comments,
        {
          content: newComment,
          user: {
            _id: authUser._id,
            name: authUser.name,
            profilePicture: authUser.profilePicture,
          },
          createdAt: new Date(),
        },
      ]);
    }
  };

  const content = post?.content;
  const { links, originalString } = extractLinks(content);
  return (
    <div className="bg-base-100 text-base-content rounded-lg shadow mb-4">
      <div className="p-4">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center">
            <Link to={`/profile/${post?.author?.username}`}>
              <img
                src={post?.author?.profilePicture || "/avatar.png"}
                alt={post?.author?.name}
                className="size-10 rounded-full mr-3 object-cover overflow-hidden"
              />
            </Link>

            <div>
              <Link to={`/profile/${post?.author?.username}`}>
                <h3 className="font-semibold">{post?.author?.name}</h3>
              </Link>
              <p className="text-xs text-info">{post?.author?.headline}</p>
              <p className="text-xs text-info">
                {formatDistanceToNow(new Date(post?.createdAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
          </div>
          {isOwner && (
            <button
              onClick={() => confirmDelete()}
              className="text-red-500 hover:text-red-700"
            >
              {isDeletingPost ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Trash2 size={18} />
              )}
            </button>
          )}
        </div>
        {links.length > 0 && (
          <Microlink style={{ width: "100%" }} url={links[0]} />
        )}
        {/*Message*/}
        <p
          dangerouslySetInnerHTML={{ __html: originalString }}
          className=" ProseMirror"
        ></p>

        {/* Vista previa del archivo adjunto */}
        {post?.image && (
          <div className="mt-4">
            {(() => {
              const fileUrl = post?.image;
              const extension = fileUrl.split(".").pop().toLowerCase();

              if (["jpg", "jpeg", "png", "webp", "gif"].includes(extension)) {
                return (
                  <img
                    src={fileUrl}
                    alt="Adjunto"
                    className="rounded-lg w-full mb-4"
                  />
                );
              } else if (extension === "pdf") {
                return (
                  <div className="flex items-center justify-between bg-gray-100 p-4 rounded-md mb-4 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <h1 className="font-semibold text-xl text-gray-800">
                        Descarga el Archivo
                      </h1>

                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline truncate max-w-xs"
                      >
                        <span className="font-medium">
                          {fileUrl.split("/").pop()}
                        </span>
                      </a>
                    </div>

                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-2 text-white rounded-lg hover:bg-red-100 transition-colors duration-300"
                    >
                      <img src="/images/file/PDF.png" alt="" className="w-10" />
                    </a>
                  </div>
                );
              } else if (extension === "ppt") {
                return (
                  <div className="flex items-center justify-between bg-gray-100 p-4 rounded-md mb-4 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <h1 className="font-semibold text-xl text-gray-800">
                        Descarga el Archivo
                      </h1>

                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline truncate max-w-xs"
                      >
                        <span className="font-medium">
                          {fileUrl.split("/").pop()}
                        </span>
                      </a>
                    </div>

                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-2 text-white rounded-lg hover:bg-red-100 transition-colors duration-300"
                    >
                      <img src="/images/file/PPT.png" alt="" className="w-10" />
                    </a>
                  </div>
                );
              } else if (extension === "pptx") {
                return (
                  <div className="flex items-center justify-between bg-gray-100 p-4 rounded-md mb-4 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <h1 className="font-semibold text-xl text-gray-800">
                        Descarga el Archivo
                      </h1>

                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline truncate max-w-xs"
                      >
                        <span className="font-medium">
                          {fileUrl.split("/").pop()}
                        </span>
                      </a>
                    </div>

                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-2 text-white rounded-lg hover:bg-red-100 transition-colors duration-300"
                    >
                      <img
                        src="/images/file/PPTX.png"
                        alt=""
                        className="w-10"
                      />
                    </a>
                  </div>
                );
              } else if (["mp3", "wav"].includes(extension)) {
                return (
                  <div className="flex ">
                    <Waveform url={fileUrl} className="cursor-pointer" />
                  </div>
                );
              } else if (["mp4", "mpeg", "webm", "ogg"].includes(extension)) {
                return (
                  <div className="flex">
                    <video
                      src={fileUrl}
                      controls
                      className="cursor-pointer bg-amber-400"
                    />
                  </div>
                );
              } else {
                return (
                  <div className="flex items-center justify-between bg-gray-100 p-4 rounded-md mb-4 shadow-md hover:shadow-lg transition-all duration-300">
                    <div className="flex items-center space-x-4">
                      <h1 className="font-semibold text-xl text-gray-800">
                        Descarga el Archivo
                      </h1>

                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 underline truncate max-w-xs"
                      >
                        <span className="font-medium">
                          {fileUrl.split("/").pop()}
                        </span>
                      </a>
                    </div>

                    <a
                      href={fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors duration-300"
                    >
                      <Download size={32} />
                    </a>
                  </div>
                );
              }
            })()}
          </div>
        )}

        <div className="flex justify-between text-info">
          <PostAction
            icon={
              <ThumbsUp
                size={18}
                className={isLiked ? "text-blue-500  fill-blue-300" : ""}
              />
            }
            text={`Like (${post?.likes?.length})`}
            onClick={handleLikePost}
          />

          <PostAction
            icon={<MessageCircle size={18} />}
            text={`Comment (${comments.length})`}
            onClick={() => setShowComments(!showComments)}
          />
          <PostAction icon={<Share2 size={18} />} text="Share" />
        </div>
      </div>

      {showComments && (
        <div className="px-4 pb-4">
          <div className="mb-4 max-h-60 overflow-y-auto">
            {comments.map((comment) => (
              <div
                key={comment._id}
                className="mb-2 bg-base-100 p-2 rounded flex items-start"
              >
                <img
                  src={comment.user.profilePicture || "/avatar.png"}
                  alt={comment.user.name}
                  className="w-8 h-8 rounded-full mr-2 flex-shrink-0"
                />
                <div className="flex-grow">
                  <div className="flex items-center mb-1">
                    <span className="font-semibold mr-2">
                      {comment.user.name}
                    </span>
                    <span className="text-xs text-info">
                      {formatDistanceToNow(new Date(comment.createdAt))}
                    </span>
                  </div>
                  <p>{comment.content}</p>
                </div>
              </div>
            ))}
          </div>

          <form onSubmit={handleAddComment} className="flex items-center">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Add a comment..."
              className="flex-grow p-2 rounded-l-full bg-base-100 focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <button
              type="submit"
              className="bg-primary text-white p-3 rounded-r-full hover:bg-primary-dark transition duration-300"
              disabled={isAddingComment}
            >
              {isAddingComment ? (
                <Loader size={18} className="animate-spin" />
              ) : (
                <Send size={18} />
              )}
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
export default Post;
