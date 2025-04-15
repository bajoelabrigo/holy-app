export const getOtherParticipant = (conversation, authUserId) => {
  if (
    !conversation ||
    conversation.isGroup ||
    !authUserId ||
    !Array.isArray(conversation.participants)
  ) {
    return null;
  }

  return conversation.participants.find(
    (p) => String(p._id) !== String(authUserId)
  );
};
