export const getConversationId = (user, users = []) => {
  if (!user || users.length !== 2) return null;

  const otherUser = users.find((u) => String(u._id) !== String(user._id));
  return otherUser?._id || null;
};

export const getConversationName = (user, users = []) => {
  if (!user || users.length !== 2) return "Usuario";

  const otherUser = users.find((u) => String(u._id) !== String(user._id));
  return otherUser?.name || "Usuario";
};

export const getConversationPicture = (user, users = []) => {
  if (!user || users.length !== 2) return "/avatar.png";

  const otherUser = users.find((u) => String(u._id) !== String(user._id));
  return otherUser?.profilePicture || "/avatar.png";
};
