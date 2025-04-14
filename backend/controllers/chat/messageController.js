import { getReceiverSocketId, io } from "../../lib/socket.js";
import Conversation from "../../models/chat/conversationModel.js";
import Message from "../../models/chat/messageModel.js";
import User from "../../models/userModel.js";
import Group from "../../models/chat/groupModel.js";

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
    const { message, files } = req.body;
    const { id: conversationId } = req.params;
    const senderId = req.user._id;

    if (!message && (!files || files.length === 0)) {
      return res.status(400).json({ error: "El mensaje no puede estar vacío" });
    }

    // ✅ buscar conversación por su _id directo
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({ error: "Conversación no encontrada" });
    }

    const newMessage = new Message({
      senderId,
      receiverId: conversation.isGroup
        ? null
        : conversation.participants.find(
            (p) => p.toString() !== senderId.toString()
          ),
      conversationId: conversation._id,
      message,
      files: files || [],
    });

    conversation.messages.push(newMessage._id);
    await Promise.all([conversation.save(), newMessage.save()]);

    const populatedMessage = await Message.findById(newMessage._id)
      .populate("senderId", "-password")
      .populate("receiverId", "-password");

    // socket emit...
    conversation.participants.forEach((participantId) => {
      if (participantId.toString() !== senderId.toString()) {
        const socketId = getReceiverSocketId(participantId.toString());
        if (socketId) {
          io.to(socketId).emit("newMessage", populatedMessage);
        }
      }
    });

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// GET - Obtener mensajes por conversación
export const getMessages = async (req, res) => {
  const { id: conversationId } = req.params;

  try {
    const messages = await Message.find({ conversationId })
      .populate("senderId", "-password")
      .populate("receiverId", "-password")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Error al obtener mensajes:", error);
    res.status(500).json({ message: "Error al obtener los mensajes" });
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

    // 1. Crear conversación
    const groupConversation = await Conversation.create({
      name,
      participants: [...participants, adminId],
      admin: adminId,
      isGroup: true,
      messages: [],
    });

    // 2. Crear grupo asociado
    await Group.create({
      _id: groupConversation._id,
      name,
      admin: adminId,
      participants: [...participants, adminId],
      status: "Grupo", // <--- asegúrate que esto esté
      profilePicture: "", // o una por defecto
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

// POST /messages/conversation/:receiverId
export const createOneToOneConversation = async (req, res) => {
  try {
    const senderId = req.user._id;
    const receiverId = req.params.receiverId;

    if (!receiverId) {
      return res.status(400).json({ error: "Receptor no especificado" });
    }

    // Buscar si ya existe una conversación entre los dos
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
      isGroup: false,
    });

    if (!conversation) {
      // Crear nueva conversación
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
        isGroup: false,
        messages: [],
      });
    }

    const fullConversation = await conversation.populate(
      "participants",
      "-password"
    );
    console.log(
      "🧪 Creando conversación entre:",
      req.user._id,
      "y",
      req.params.receiverId
    );

    res.status(201).json(fullConversation);
  } catch (error) {
    console.error("Error en crear conversacion 1 a 1:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
