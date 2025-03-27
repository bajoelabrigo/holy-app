import { updatedLatestMessage } from "../../services/conversation.service.js";
import {
  createMessage,
  getConvoMessages,
  populateMessage,
} from "../../services/message.service.js";

export const sendMessage = async (req, res, next) => {
  try {
    const user_id = req.user._id;
    const { message, convo_id, files } = req.body;
    if (!convo_id || (!message && !files)) {
      return res.status(400).json({
        message: "Please provide a conversation id and message body ",
      });
    }
    const msgData = {
      sender: user_id || req.user._id,
      message,
      conversation: convo_id,
      files: files || [],
    };
    let newMessage = await createMessage(msgData);
    let populatedMessage = await populateMessage(newMessage._id);
    await updatedLatestMessage(convo_id, newMessage);
    res.json(populatedMessage);
  } catch (error) {
    next(error);
  }
};

export const getMessages = async (req, res, next) => {
  try {
    const convo_id = req.params.convo_id;
    if (!convo_id) {
      return res.status(400).json({
        message: "Please add a conversation id in params ",
      });
    }
    const messages = await getConvoMessages(convo_id);
    res.json(messages);
  } catch (error) {
    next(error);
  }
};
