import { useEffect } from "react";
import { useSocketContext } from "../context/SocketContext";
import useConversation from "../zustand/useConversation";
import notificationSound from "../src/assets/sounds/notification.mp3";

const useListenMessages = () => {
  const { socket } = useSocketContext();
  const { selectedConversation, addMessageToConversation } = useConversation();

  useEffect(() => {
    if (!socket || !selectedConversation?._id) return;

    const handleNewMessage = (newMessage) => {
      // Asegura que el mensaje sea para la conversación activa
      if (newMessage.conversationId !== selectedConversation._id) {
        console.log("📭 Ignorado: no es la conversación activa");
        return;
      }

      console.log("💬 Nuevo mensaje recibido:", newMessage);

      // Agrega a Zustand
      addMessageToConversation(selectedConversation._id, newMessage);

      // Reproduce sonido
      if (document.visibilityState === "visible") {
        const sound = new Audio(notificationSound);
        sound
          .play()
          .catch((err) =>
            console.warn("🔇 Error al reproducir sonido:", err.message)
          );
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, selectedConversation?._id, addMessageToConversation]);
};

export default useListenMessages;
