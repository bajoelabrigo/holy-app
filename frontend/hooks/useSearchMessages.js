import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../src/lib/axios";

export const useSearchMessages = ({ query, conversationId, page = 1 }) => {
  return useQuery({
    queryKey: ["searchMessages", query, conversationId, page],
    queryFn: async () => {
      const res = await axiosInstance.get(
        `/messages/search?query=${query}&conversationId=${conversationId}&page=${page}&limit=10`
      );
      return res.data;
    },
    enabled: !!query && !!conversationId, // Solo busca si hay texto e ID
    keepPreviousData: true,
  });
};
