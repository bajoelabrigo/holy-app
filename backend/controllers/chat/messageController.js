import { getReceiverSocketId, io } from "../../lib/socket.js";
import Conversation from "../../models/chat/conversationModel.js";
import Message from "../../models/chat/messageModel.js";
import User from "../../models/userModel.js";

// GET - Usuarios para la barra lateral
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const users = await User.find({ _id: { $ne: loggedInUserId } }).select(
      "-password"
    );
    res.status(200).json(users);
  } catch (error) {
    console.error("Error in getUsersForSidebar:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST - Enviar mensaje (1 a 1 o grupo)
export const sendMessage = async (req, res) => {
  try {
    const { message, files, isGroup = false } = req.body;
    const { id } = req.params; // puede ser userId o conversationId
    const senderId = req.user._id;

    if (!message && (!files || files.length === 0)) {
      return res.status(400).json({ error: "El mensaje no puede estar vacío" });
    }

    let conversation;

    if (isGroup) {
      conversation = await Conversation.findById(id);
      if (!conversation || !conversation.isGroup) {
        return res.status(404).json({ error: "Grupo no encontrado" });
      }
    } else {
      // Mensaje 1 a 1, buscamos o creamos la conversacion
      conversation = await Conversation.findOne({
        participants: { $all: [senderId, id] },
        isGroup: false,
      });

      if (!conversation) {
        conversation = await Conversation.create({
          participants: [senderId, id],
          isGroup: false,
          messages: [],
        });
      }
    }

    const newMessage = new Message({
      senderId,
      receiverId: isGroup ? null : id,
      conversationId: conversation._id, // <--- esta línea es clave
      message,
      files: files || [],
    });

    conversation.messages.push(newMessage._id);
    await Promise.all([conversation.save(), newMessage.save()]);

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("senderId", "-password")
      .populate("receiverId", "-password");

    // SOCKET
    if (isGroup) {
      conversation.participants.forEach((participantId) => {
        if (participantId.toString() !== senderId.toString()) {
          const socketId = getReceiverSocketId(participantId.toString());
          if (socketId) {
            io.to(socketId).emit("newMessage", populatedMessage);
          }
        }
      });
    } else {
      const receiverSocketId = getReceiverSocketId(id);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", populatedMessage);
      }
    }

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET - Obtener mensajes por conversación
export const getMessages = async (req, res) => {
  try {
    const { id } = req.params; // id de conversacion
    const conversation = await Conversation.findById(id).populate({
      path: "messages",
      populate: [
        { path: "senderId", select: "-password" },
        { path: "receiverId", select: "-password" },
      ],
    });

    if (!conversation)
      return res.status(404).json({ error: "Conversacion no encontrada" });

    res.status(200).json(conversation.messages);
  } catch (error) {
    console.error("Error in getMessages:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// POST - Crear grupo
export const createGroupChat = async (req, res) => {
  try {
    const { name, participants } = req.body;
    const adminId = req.user._id;

    if (!name || !participants || participants.length < 2) {
      return res
        .status(400)
        .json({ error: "Proporciona un nombre y al menos 2 participantes" });
    }

    const groupConversation = await Conversation.create({
      name,
      participants: [...participants, adminId],
      admin: adminId,
      isGroup: true,
      messages: [],
    });

    const fullGroup = await groupConversation.populate(
      "participants",
      "-password"
    );
    res.status(201).json(fullGroup);
  } catch (error) {
    console.error("Error in createGroupChat:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// PUT - Editar mensaje
export const editMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const { newText } = req.body;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message)
      return res.status(404).json({ error: "Mensaje no encontrado" });
    if (message.senderId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "Solo puedes editar tus propios mensajes" });
    }

    message.message = newText;
    message.edited = true;
    await message.save();

    res.status(200).json(message);
  } catch (error) {
    console.error("Error in editMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// DELETE - Eliminar mensaje
export const deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.user._id;

    const message = await Message.findById(messageId);
    if (!message)
      return res.status(404).json({ error: "Mensaje no encontrado" });
    if (message.senderId.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ error: "Solo puedes eliminar tus propios mensajes" });
    }

    await Conversation.updateOne(
      { messages: messageId },
      { $pull: { messages: messageId } }
    );

    await message.deleteOne();
    res.status(200).json({ message: "Mensaje eliminado correctamente" });
  } catch (error) {
    console.error("Error in deleteMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
