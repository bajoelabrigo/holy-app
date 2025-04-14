import { axiosInstance } from "../src/lib/axios";
import toast from "react-hot-toast";
import { handleError } from "./chatService";
import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation";

const useGetMessages = () => {
  const [loading, setLoading] = useState(false);
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    const getMessages = async () => {
      setLoading(true);
      try {
        const res = await axiosInstance.get(
          `/messages/${selectedConversation._id}`
        );
        if (res.data.error) throw new Error(res.data.error);
        setMessages(res.data);
      } catch (error) {
        toast.error(handleError(error) || "Something went wrong");
      } finally {
        setLoading(false);
      }
    };
    if (selectedConversation?._id) getMessages();
  }, [selectedConversation?._id, setMessages]);

  return { loading, messages };
};

export default useGetMessages;
