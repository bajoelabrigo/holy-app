import { axiosInstance } from "../src/lib/axios";
import toast from "react-hot-toast";
import { handleError } from "./chatService";
import useConversation from "../zustand/useConversation";
import { useState } from "react";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { selectedConversation, addMessageToConversation } = useConversation();
  const [files, setFiles] = useState([]);

  const clearFiles = () => setFiles([]);
  const addFiles = (newFiles) => {
    if (!Array.isArray(newFiles)) {
      console.error("addFiles received a non-array value:", newFiles);
      return;
    }
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const sendMessage = async ({ message, files = [] }) => {
    if (!selectedConversation || !selectedConversation._id) {
      toast.error("No conversation selected.");
      return;
    }

    const conversationId = selectedConversation._id;

    setLoading(true);
    try {
      console.log("🧠 Enviando mensaje a conversación:", conversationId);

      const res = await axiosInstance.post(
        `/messages/send/${conversationId}`,
        { message, files },
        { headers: { "Content-Type": "application/json" } }
      );

      addMessageToConversation(conversationId, res.data);
    } catch (error) {
      toast.error(handleError(error) || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading, addFiles, files, setFiles, clearFiles };
};

export default useSendMessage;
