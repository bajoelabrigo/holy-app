import toast from "react-hot-toast";
import { axiosInstance } from "../src/lib/axios";

// Manejo de errores
export const handleError = (error) => {
  const message =
    error.response?.data?.message || error.message || "An error occurred";
  toast.error(message);
  return message;
};

// Obtener usuarios para el chat
export const getUsersChat = async () => {
  try {
    const res = await axiosInstance.get("/messages/users");
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// Obtener mensajes para un usuario específico
export const getMessagesChat = async (userId) => {
  try {
    const res = await axiosInstance.get(`/messages/${userId}`);
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

// Enviar un mensaje a un usuario
export const sendMessageChat = async (messageData, selectedUser) => {
  try {
    const res = await axiosInstance.post(
      `/messages/send/${selectedUser._id}`,
      messageData
    );
    return res.data;
  } catch (error) {
    handleError(error);
  }
};

export const createConversation = async (receiverId) => {
  const res = await axiosInstance.post(`/messages/conversation/${receiverId}`);
  console.log("crear conversation", res.data)
  return res.data;
};
