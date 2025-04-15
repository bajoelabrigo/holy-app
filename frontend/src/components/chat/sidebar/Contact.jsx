import React from "react";
import useConversation from "../../../../zustand/useConversation";
import { useSocketContext } from "../../../../context/SocketContext";
import { createConversation } from "../../../../hooks/chatService";

const Contact = ({ contact }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { onlineUsers } = useSocketContext();

  // Verificar si el contacto está online
  const isOnline = onlineUsers?.includes(String(contact?._id));

  // Verificar si esta conversación está seleccionada (comparando participantes)
  const isSelected = selectedConversation?.participants?.some(
    (p) => String(p._id) === String(contact._id)
  );

  // Cuando se hace clic sobre un contacto
  const handleSelect = async () => {
    try {
      const fullConversation = await createConversation(contact._id);
      setSelectedConversation(fullConversation);
    } catch (err) {
      console.error("❌ Error al seleccionar conversación:", err);
    }
  };

  return (
    <li
      className={`list-none mt-1 h-[90px] ${
        isSelected ? "bg-blue-900" : ""
      } cursor-pointer px-[10px]`}
      onClick={handleSelect}
    >
      {/*Container */}
      <div className="flex items-center gap-x-3 py-[10px]">
        {/* Avatar */}
        <div className="relative min-w-[50px] max-w-[50px] h-[50px] rounded-full overflow-hidden">
          <img
            src={contact?.profilePicture || "/avatar.png"}
            alt={contact?.name}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="w-full flex flex-col">
          {/* Name + status */}
          <div className="flex gap-3 justify-between">
            <h1
              className={`font-bold text-base-content ${
                isSelected ? "text-white" : ""
              }`}
            >
              {contact?.name}
            </h1>
            <p className={`${isOnline ? "text-success" : "text-error"}`}>
              {isOnline ? "online" : "offline"}
            </p>
          </div>

          {/* Estado personalizado */}
          <p
            className={`font-extralight text-base-content ${
              isSelected ? "text-white" : ""
            }`}
          >
            {contact?.status || "Disponible"}
          </p>
        </div>
      </div>

      {/* Línea divisoria */}
      <div className="ml-16 mt-6 border-b" />
    </li>
  );
};

export default Contact;
