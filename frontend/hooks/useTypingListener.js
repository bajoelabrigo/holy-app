import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

/**
 * Escucha el evento "typing" y actualiza Zustand
 */
const useTypingListener = () => {
  const { socket } = useSocketContext();
  const { setTyping, clearTyping } = useConversation();

  useEffect(() => {
    if (!socket) return;

    const handleTyping = ({ conversationId, senderName }) => {
      console.log("👂 typing recibido en hook:", senderName);
      setTyping(conversationId, senderName);

      setTimeout(() => {
        clearTyping(conversationId);
      }, 2000);
    };

    socket.on("typing", handleTyping);
    return () => socket.off("typing", handleTyping);
  }, [socket, setTyping, clearTyping]);
};

export default useTypingListener;
