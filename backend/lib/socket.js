import http from "http";
import express from "express";
import { Server } from "socket.io";

const app = express();

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: [process.env.CLIENT_URL],
    methods: ["GET", "POST"],
  },
});

export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};

const userSocketMap = {}; // {userId: socketId}

io.on("connection", (socket) => {
  const userId = socket.handshake.query.userId;
  console.log("🟢 Usuario conectado:", userId, "| Socket ID:", socket.id);

  if (userId && userId !== "undefined") {
    userSocketMap[userId] = socket.id;
    // 👉 Imprimir todos los usuarios conectados
    console.log(
      "📡 Usuarios actualmente conectados:",
      Object.keys(userSocketMap)
    );

    // Notificar a todos los clientes
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  }

  // ✅ SIEMPRE registrar los eventos aunque no haya userId
  socket.on("disconnect", () => {
    console.log("🔌 Usuario desconectado:", userId);
    delete userSocketMap[userId];

    console.log(
      "📡 Usuarios conectados tras desconexión:",
      Object.keys(userSocketMap)
    );
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });

  socket.on("joinConversation", (conversationId) => {
    console.log(`📥 ${socket.id} joined conversation ${conversationId}`);
    socket.join(conversationId);
  });

  socket.on("typing", ({ conversationId, senderName }) => {
    console.log("✏️ typing recibido:", senderName, "en", conversationId);
    socket.to(conversationId).emit("typing", { conversationId, senderName });
  });
});

export { app, io, server };
