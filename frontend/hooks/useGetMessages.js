import { useEffect, useState } from "react";
import { axiosInstance } from "../src/lib/axios";
import toast from "react-hot-toast";
import { handleError } from "./chatService";
import useConversation from "../zustand/useConversation";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const {
    selectedConversation,
    messagesByConversation,
    setMessagesForConversation,
  } = useConversation();

  const conversationId = selectedConversation?._id;
  const messages = messagesByConversation[conversationId] || [];

  const fetchMessages = async () => {
    if (!conversationId) return;

    try {
      setLoading(true);
      const res = await axiosInstance.get(`/messages/${conversationId}`);
      setMessagesForConversation(conversationId, res.data.messages || res.data);
    } catch (error) {
      toast.error(handleError(error) || "Error al obtener los mensajes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!conversationId) return;

    if (messages.length > 0) return;

    let isMounted = true;

    const load = async () => {
      try {
        setLoading(true);
        const res = await axiosInstance.get(`/messages/${conversationId}`);
        if (isMounted) {
          setMessagesForConversation(
            conversationId,
            res.data.messages || res.data
          );
        }
      } catch (error) {
        toast.error("Error al obtener los mensajes");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    load();

    return () => {
      isMounted = false;
    };
  }, [conversationId]);

  const deleteMessage = async (messageId) => {
    try {
      await axiosInstance.delete(`/messages/message/${messageId}`);
      const current = messagesByConversation[conversationId] || [];
      const updated = current.filter((msg) => msg._id !== messageId);
      setMessagesForConversation(conversationId, updated);
      toast.success("Mensaje eliminado");
    } catch (error) {
      toast.error("No se pudo eliminar el mensaje");
    }
  };

  const editMessage = async (messageId, newText) => {
    try {
      await axiosInstance.put(`/messages/message/${messageId}`, { newText });
      const current = messagesByConversation[conversationId] || [];
      const updated = current.map((msg) =>
        msg._id === messageId ? { ...msg, message: newText, edited: true } : msg
      );
      setMessagesForConversation(conversationId, updated);
      toast.success("Mensaje editado");
    } catch (error) {
      toast.error("No se pudo editar el mensaje");
    }
  };

  return {
    loading,
    messages,
    fetchMessages,
    deleteMessage,
    editMessage,
  };
};

export default useGetMessages;
