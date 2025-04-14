import Conversation from "../../models/chat/conversationModel.js";
import Group from "../../models/chat/groupModel.js";

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
        options: { sort: { createdAt: -1 }, limit: 1 },
      });

    const formattedConversations = [];

    for (const convo of conversations) {
      console.log("🔍 Procesando conversación:", convo._id);

      if (convo.isGroup) {
        const group = await Group.findOne({ _id: convo._id });
        console.log("📛 Grupo encontrado:", group?.name);

        if (group) {
          formattedConversations.push({
            _id: convo._id,
            name: group.name || "Grupo sin nombre",
            profilePicture: group.profilePicture || "/group-default.png",
            status: group.status || "Grupo",
            isGroup: true,
            participants: convo.participants,
          });
        }
      } else {
        const otherUser = convo.participants.find(
          (p) => p._id.toString() !== userId.toString()
        );

        console.log("👤 Otro usuario:", otherUser?.name);

        if (otherUser) {
          formattedConversations.push({
            _id: convo._id,
            name: otherUser.name || "Usuario",
            profilePicture: otherUser.profilePicture || "/avatar.png",
            status: otherUser.status || "Conversación privada",
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
