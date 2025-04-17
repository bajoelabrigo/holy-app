import { useEffect, useState } from "react";
import { axiosInstance } from "../src/lib/axios";
import toast from "react-hot-toast";
import { handleError } from "./chatService";

const useGetConversations = () => {
  const [loading, setLoading] = useState(true);
  const [conversations, setConversations] = useState([]);

  useEffect(() => {
    const getConversations = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get("/messages/conversations");
        //console.log("👉 Conversaciones desde backend:", res.data); // <-- Agregado aquí

        const updatedConversations = res.data.map((conv) => {
          if (conv.isGroup) {
            return {
              ...conv,
              name: conv.name || "Grupo sin nombre",
              profilePicture: conv.profilePicture || "/group-default.png",
              status: `${conv.participants?.length || 0} miembros`,
            };
          } else {
            return {
              ...conv,
              name: conv.name || conv.username || "Usuario sin nombre",
              profilePicture: conv.profilePicture || "/avatar.png",
              status: "Conversación privada",
            };
          }
        });

        setConversations(updatedConversations);
      } catch (error) {
        toast.error(handleError(error));
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, []);

  return { loading, conversations };
};

export default useGetConversations;
