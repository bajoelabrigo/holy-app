import { axiosInstance } from "../src/lib/axios";
import toast from "react-hot-toast";
import { handleError } from "./chatService";
import useConversation from "../zustand/useConversation";
import { useState } from "react";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();
  const [files, setFiles] = useState([]); // Estado local para manejar archivos

  const addFiles = (newFiles) => {
    if (!Array.isArray(newFiles)) {
      console.error("addFiles received a non-array value:", newFiles);
      return;
    }
    setFiles((prevFiles) => [...prevFiles, ...newFiles]);
  };

  const sendMessage = async (message, files = []) => {
    if (!selectedConversation || !selectedConversation._id) {
      toast.error("No conversation selected.");
      return;
    }

    if (!message || message.trim() === "") {
      toast.error("Cannot send an empty message.");
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("message", message);
      files.forEach((file) => formData.append("files", file));
      const res = await axiosInstance.post(
        `/messages/send/${selectedConversation._id}`,
        {
          message,
          files,
        },
        { headers: { "Content-Type": "application/json" } }
      );
      setMessages([...messages, res.data]);
    } catch (error) {
      toast.error(handleError(error) || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  return { sendMessage, loading, addFiles, files, setFiles };
};

export default useSendMessage;
