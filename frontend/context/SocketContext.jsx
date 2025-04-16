import { createContext, useState, useEffect, useContext } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import io from "socket.io-client";
import { SET_ONLINE_USERS } from "../src/redux/fectures/auth/authSlice";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const dispatch = useDispatch();
  const { user: authUser } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (authUser && authUser._id) {
      const socket = io("http://localhost:5000", {
        query: {
          userId: authUser._id,
        },
      });

      setSocket(socket);

      socket.on("newPost", (post) => {
        console.log("📡 Nuevo post recibido vía socket:", post);

        // 🔄 Agregar al inicio de la primera página de posts
        queryClient.setQueryData(["posts"], (oldData) => {
          if (!oldData) return;
          return {
            ...oldData,
            pages: [[post, ...oldData.pages[0]], ...oldData.pages.slice(1)],
          };
        });
      });

      socket.on("getOnlineUsers", (users) => {
        console.log("📡 Usuarios online recibidos:", users);
        dispatch(SET_ONLINE_USERS(users));
      });

      return () => socket.disconnect(); // ✅ Esto es clave
    } else {
      if (socket) {
        socket.disconnect();
        setSocket(null);
      }
    }
  }, [authUser]);

  useEffect(() => {
    if (socket) {
      socket.onAny((event, ...args) => {});
    }
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    socket.on("newMessage", (data) => {
      console.log("Nuevo mensaje recibido via socket:", data); // <- ¿Esto aparece?

      // Mostrar notificación del navegador
      if (Notification.permission === "granted") {
        new Notification("Nuevo mensaje", {
          body: `${data.senderId.name}: ${data.message}`,
          icon: "/chat-icon.png", // opcional
        });
      }
    });

    return () => {
      socket.off("newMessage");
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
