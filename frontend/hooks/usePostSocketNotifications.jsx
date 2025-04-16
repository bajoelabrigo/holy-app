// 🔔 Custom toast con animacion y scroll hacia el post
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { io } from "socket.io-client";
import { animateScroll as scroll } from "react-scroll";
import { motion, AnimatePresence } from "framer-motion";

const usePostSocketNotifications = (authUser) => {
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!authUser) return;

    const socket = io("http://localhost:5000", {
      query: { userId: authUser._id },
    });

    socket.on("newPost", (post) => {
      if (post.author._id !== authUser._id) {
        toast.custom((t) => {
          // 🔄 Desaparece automáticamente después de 10s
          setTimeout(() => toast.dismiss(t.id), 10000);

          console.log("POST",post)

          return (
            <AnimatePresence>
              {t.visible && (
                <motion.div
                  initial={{ opacity: 0, y: -50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="max-w-sm w-full bg-base-100 border border-primary p-4 rounded shadow-lg flex items-center gap-4"
                >
                  <img
                    src={post.author.profilePicture || "/avatar.png"}
                    alt="avatar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-primary">
                      {post.author.name} acaba de publicar algo nuevo
                    </p>
                    <p className="text-sm text-base-content truncate">
                      {post.content?.slice(0, 50) || "Nueva publicacion"}
                    </p>
                  </div>
                  <button
                    onClick={() => toast.dismiss(t.id)}
                    className="text-sm text-gray-400 hover:text-red-400"
                  >
                    ✕
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          );
        });
      }

      // Insertar el nuevo post al principio
      queryClient.setQueryData(["posts"], (oldData) => {
        if (!oldData) return;
        return {
          ...oldData,
          pages: [[post, ...oldData.pages[0]], ...oldData.pages.slice(1)],
        };
      });

      // Scroll al principio
      scroll.scrollToTop({ smooth: true });
    });

    return () => socket.disconnect();
  }, [authUser, queryClient]);
};

export default usePostSocketNotifications;
