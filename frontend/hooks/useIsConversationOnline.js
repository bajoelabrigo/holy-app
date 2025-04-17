import { useSelector } from "react-redux";
import { selectOnlineUsers } from "../src/redux/fectures/auth/authSlice";

const useIsConversationOnline = (conversation) => {
  const onlineUsers = useSelector(selectOnlineUsers);

  // Fallback si no hay participants (caso de 1 a 1 directo)
  const participantIds = Array.isArray(conversation?.participants)
    ? conversation.participants.map((p) => String(p._id))
    : conversation?._id
    ? [String(conversation._id)]
    : [];

  const isOnline = participantIds.some((id) =>
    onlineUsers.includes(String(id))
  );

  // console.log("participantsIds", participantIds);
  // console.log("OnlineUsers", onlineUsers);
  // console.log("✅ ¿Alguien online?:", isOnline);

  return isOnline;
};

export default useIsConversationOnline;
