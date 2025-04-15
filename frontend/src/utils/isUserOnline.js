import { getOtherParticipant } from "./getOtherParticipant";

export const isUserOnline = (conversation, authUser, onlineUsers) => {
  if (!conversation || !authUser || !onlineUsers) return false;

  const otherUser = getOtherParticipant(conversation, authUser._id);
  if (!otherUser || !otherUser._id) return false;

  return onlineUsers.includes(String(otherUser._id));
};
