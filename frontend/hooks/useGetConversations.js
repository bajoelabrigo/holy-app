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
        const res = await axiosInstance.get("/messages/users");
        setConversations(res.data);
      } catch (error) {
        toast(handleError(error));
      } finally {
        setLoading(false);
      }
    };
    getConversations()
  }, []);

  return { loading, conversations };
};

export default useGetConversations;
