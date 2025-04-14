import Conversation from "../../models/chat/conversationModel.js";
import Group from "../../models/chat/groupModel.js";
import User from "../../models/userModel.js";

export const getUserConversations = async (req, res) => {
  try {
    const userId = req.user._id;

    // Buscar todas las conversaciones donde el usuario participa
    const conversations = await Conversation.find({
      participants: userId,
    })
      .populate({
        path: "participants",
        select: "name profilePicture status",
      })
      .populate({
        path: "messages",
        options: { sort: { createdAt: -1 }, limit: 1 }, // obtener el ultimo mensaje si lo deseas
      });

    const formattedConversations = [];

    for (const convo of conversations) {
      const isGroup = convo.participants.length > 2;

      if (isGroup) {
        // Intentamos buscar si hay un grupo creado con ese mismo conversationId
        const group = await Group.findOne({ _id: convo._id });

        if (group) {
          formattedConversations.push({
            _id: convo._id,
            name: group.name,
            profilePicture: group.profilePicture,
            status: group.status || "Grupo",
            isGroup: true,
          });
        }
      } else {
        // Conversacion 1 a 1: encontrar el otro participante
        const otherUser = convo.participants.find(
          (p) => p._id.toString() !== userId.toString()
        );

        if (otherUser) {
          formattedConversations.push({
            _id: convo._id,
            name: otherUser.name,
            profilePicture: otherUser.profilePicture,
            status: otherUser.status,
            isGroup: false,
          });
        }
      }
    }

    res.status(200).json(formattedConversations);
  } catch (error) {
    console.error("Error in getUserConversations:", error);
    res.status(500).json({ error: "Error al obtener conversaciones" });
  }
};
