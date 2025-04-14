import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";

/**
 * Hook que se encarga de unir el socket a la conversación activa.
 * Se debe ejecutar solo una vez al entrar a una conversación.
 */
const useJoinConversation = () => {
  const { socket } = useSocketContext();
  const { selectedConversation } = useConversation();

  useEffect(() => {
    if (!socket) {
      console.warn("❌ Socket no disponible todavía");
      return;
    }

    if (selectedConversation?._id) {
      console.log("🚀 Emitiendo joinConversation:", selectedConversation._id);
      socket.emit("joinConversation", selectedConversation._id);
    } else {
      console.warn("⚠️ No hay selectedConversation aún");
    }
  }, [socket, selectedConversation?._id]);
};

export default useJoinConversation;
