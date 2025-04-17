import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../src/lib/axios";

export const useSearchPosts = (query) => {
  return useQuery({
    queryKey: ["searchPosts", query],
    queryFn: async () => {
      const res = await axiosInstance.get(`/posts/search?query=${query}`);
      return res.data;
    },
    enabled: !!query && query.length > 2, // Solo se ejecuta si hay al menos 3 caracteres
    staleTime: 0,
  });
};
