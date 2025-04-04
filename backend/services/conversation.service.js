import createHttpError from "http-errors";
import ConversationModel from "../models/chat/conversationModel.js"
import User from "../models/userModel.js";

export const doesConversationExist = async (
  sender_id,
  receiver_id,
  isGroup
) => {
  if (isGroup === false) {
    let convos = await ConversationModel.find({
      isGroup: false,
      $and: [
        //check if the sender or receiver is in the conversation
        { users: { $elemMatch: { $eq: sender_id } } },
        { users: { $elemMatch: { $eq: receiver_id } } },
      ],
    })
      //if exist populate the conversation with all information unless password
      .populate("users", "-password")
      .populate("latestMessage");

    if (!convos)
      throw createHttpError.BadRequest("Oops...Something went wrong !");

    //populate message model
    convos = await User.populate(convos, {
      path: "latestMessage.sender",
      select: "name email picture status",
    });

    return convos[0];
  } else {
    //it's a group chat

    let convo = await ConversationModel.findById(isGroup)
      .populate("users admin", "-password")
      .populate("latestMessage");

    if (!convo)
      throw createHttpError.BadRequest("Oops...Something went wrong !");

    //populate message model
    convo = await User.populate(convo, {
      path: "latestMessage.sender",
      select: "name email picture status",
    });
    return convo;
  }
};

export const createConversation = async (data) => {
  const newConvo = await ConversationModel.create(data);
  if (!newConvo)
    throw createHttpError.BadRequest(
      "There are problems creating a conversation !"
    );
  return newConvo;
};

export const populatedConversation = async (
  id,
  fieldToPopulate,
  fieldToRemove
) => {
  const populatedConvo = await ConversationModel.findOne({ _id: id }).populate(
    fieldToPopulate,
    fieldToRemove
  );
  if (!populatedConvo)
    throw createHttpError.BadRequest(
      "There are problems populating the conversation !"
    );
  return populatedConvo;
};

export const getUserConversations = async (user_id) => {
  let conversations;
  await ConversationModel.find({
    users: { $elemMatch: { $eq: user_id } },
  })
    .populate("users", "-password")
    .populate("admin", "-password")
    .populate("latestMessage")
    .sort({ updatedAt: -1 })
    .then(async (results) => {
      results = await User.populate(results, {
        path: "latestMessage.sender",
        select: "name email picture status",
      });
      conversations = results;
    })
    .catch((err) => {
      throw createHttpError.BadRequest(
        "There are problems populating the conversation !"
      );
    });

  return conversations;
};

export const updatedLatestMessage = async (convo_id, msg) => {
  const updatedConvo = await ConversationModel.findByIdAndUpdate(convo_id, {
    latestMessage: msg, //id of messages
  });
  if (!updatedConvo)
    throw createHttpError.BadRequest("There is not update message to show");
  return updatedConvo;
};
