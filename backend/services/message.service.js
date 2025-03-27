import MessageModel from "../models/chat/messageModel.js";

export const createMessage = async (data) => {
  let newMessage = await MessageModel.create(data);
  if (!newMessage) {
    return res.status(400).json({ message: "Error to create message" });
  }
  return newMessage;
};

export const populateMessage = async (id) => {
  let msg = await MessageModel.findById(id)
    .populate({
      path: "sender",
      select: "name profilePicture",
      model: "User",
    })
    .populate({
      path: "conversation",
      select: "name profilePicture isGroup users",
      model: "ConversationModel",
      populate: {
        path: "users",
        select: "name email profilePicture status",
        model: "User",
      },
    });
  if (!msg)
    return res.status(400).json({ message: "There is not message created" });
  return msg;
};

export const getConvoMessages = async (convo_id) => {
  const messages = await MessageModel.find({ conversation: convo_id })
    .populate("sender", "name profilePicture email status")
    .populate("conversation");
  if (!messages) {
    return res.status(400).json({ message: "Oops...Something went wrong !" });
  }
  return messages;
};
