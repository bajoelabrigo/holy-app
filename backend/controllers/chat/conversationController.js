import {
  createConversation,
  doesConversationExist,
  getUserConversations,
  populatedConversation,
} from "../../services/conversation.service.js";

export const create_open_conversation = async (req, res, next) => {
  try {
    const sender_id = req.user._id;
    const { receiver_id, isGroup } = req.body;

    if (isGroup == false) {
      //check if receiver_id is provided
      if (!receiver_id) {
        return res.status(400).json({
          message:
            "please provide the user id you wanna start a conversation with !",
        });
      }

      //check if conversation already exists
      const existed_conversation = await doesConversationExist(
        sender_id,
        receiver_id,
        false
      );
      if (existed_conversation) {
        res.json(existed_conversation);
      } else {
        //let receiver_user = await findUser(receiver_id);
        let convoData = {
          name: "conversation name",
          picture: "conversation picture",
          isGroup: false,
          users: [sender_id, receiver_id],
        };
        const newConvo = await createConversation(convoData);
        const populated_convo = await populatedConversation(
          newConvo._id,
          "users",
          "-password"
        );
        res.status(200).json(populated_convo);
      }
    } else {
      //it's a group chat
      //check if group exists
      const existed_group_conversation = await doesConversationExist(
        "",
        "",
        isGroup
      );
      res.status(200).json(existed_group_conversation);
    }
  } catch (error) {
    next(error);
  }
};
export const getConversations = async (req, res, next) => {
  try {
    const user_id = req.user._id;
    const conversations = await getUserConversations(user_id);
    res.status(200).json(conversations);
  } catch (error) {
    next(error);
  }
};
export const createGroup = async (req, res, next) => {
  const { name, users } = req.body;
  //add current user to users
  users.push(req.user.user._id);
  if (!name || !users) {
    return res.status(400).json({ message: "Please fill all fields." });
  }
  if (users.length < 2) {
    return res
      .status(400)
      .json({ message: "Atleast 2 users are required to start a group chat." });
  }
  let convoData = {
    name,
    users,
    isGroup: true,
    admin: req.user.user._id,
    picture: process.env.DEFAULT_GROUP_PICTURE,
  };
  try {
    const newConvo = await createConversation(convoData);
    const populatedConvo = await populatedConversation(
      newConvo._id,
      "users admin",
      "-password"
    );
    res.status(200).json(populatedConvo);
  } catch (error) {
    next(error);
  }
};
