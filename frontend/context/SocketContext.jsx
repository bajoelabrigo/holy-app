import { createContext, useState, useEffect, useContext } from "react";
import { useSelector } from "react-redux";

import io from "socket.io-client";

const SocketContext = createContext();

export const useSocketContext = () => {
  return useContext(SocketContext);
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const { user: authUser } = useSelector((state) => state.auth);

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  useEffect(() => {
    if (authUser) {
      const socket = io("http://localhost:5000", {
        query: {
          userId: authUser._id,
        },
      });

      setSocket(socket);

      // socket.on() is used to listen to the events. can be used both on client and server side
      socket.on("getOnlineUsers", (users) => {
        setOnlineUsers(users);
      });

      return () => socket.close();
    } else {
      if (socket) {
        socket.close();
        setSocket(null);
      }
    }
  }, [authUser]);

  useEffect(() => {
  if (socket) {
    socket.onAny((event, ...args) => {
      console.log("📡 Evento recibido:", event, args);
    });
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
    <SocketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  );
};
