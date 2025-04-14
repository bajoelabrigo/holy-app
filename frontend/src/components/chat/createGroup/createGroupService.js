import { axiosInstance } from "../../../lib/axios";

// services/chatService.js

export const createGroupChat = (groupData) =>
  axiosInstance.post("/messages/group", groupData);

export const getAllConversations = async () => {
  const { data } = await axiosInstance.get("/chat"); // Este debe devolver grupos y privados
  return data;
};