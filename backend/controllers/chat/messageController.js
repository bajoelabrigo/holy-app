import { getReceiverSocketId, io } from "../../lib/socket.js";
import Conversation from "../../models/chat/conversationModel.js";
import Message from "../../models/chat/messageModel.js";
import User from "../../models/userModel.js";

export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id;
    const filteredUsers = await User.find({
      _id: { $ne: loggedInUserId },
    }).select("-password");

    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const sendMessage = async (req, res) => {
  try {
    const { message, files } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    let newMessage;

    if (!message && (!files || files.length === 0)) {
      return res.status(400).json({
        message: "Please provide a conversation id and message body ",
      });
    }

    newMessage = new Message({
      senderId,
      receiverId,
      message,
      files: files || [],
    });
    console.log(message);

    conversation.messages.push(newMessage._id);

    await Promise.all([conversation.save(), newMessage.save()]);

    // 🔥 Populate sender y receiver antes de devolver
    const populatedMessage = await Message.findById(newMessage._id)
      .populate("senderId", "-password")
      .populate("receiverId", "-password");

    // SOCKET IO FUNCTIONALITY WILL GO HERE
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // io.to(<socket_id>).emit() used to send events to specific client
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params;
    const senderId = req.user._id;

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userToChatId] },
    }).populate({
      path: "messages",
      populate: [
        {
          path: "senderId",
          select: "-password",
        },
        {
          path: "receiverId",
          select: "-password",
        },
      ],
    });

    // NOT REFERENCE BUT ACTUAL MESSAGES

    if (!conversation) return res.status(200).json([]);

    const messages = conversation.messages;

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
