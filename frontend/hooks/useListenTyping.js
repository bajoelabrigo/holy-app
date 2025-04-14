import { useEffect, useCallback } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

const useListenTyping = () => {
  const { socket } = useSocketContext();
  const { setTyping, clearTyping } = useConversation();

  // 🧠 La función no debe estar dentro del useEffect
  const handleTyping = useCallback(
    ({ conversationId, senderName }) => {
      console.log("👂 typing recibido en frontend:", senderName);
      setTyping(conversationId, senderName);

      setTimeout(() => {
        clearTyping(conversationId);
      }, 1000);
    },
    [setTyping, clearTyping]
  );

  useEffect(() => {
    if (!socket) return;

    socket.on("typing", handleTyping);

    return () => {
      socket.off("typing", handleTyping); // ✅ ahora sí usa misma función
    };
  }, [socket, handleTyping]);
};

export default useListenTyping;
