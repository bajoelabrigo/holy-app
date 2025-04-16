import { useInfiniteQuery } from "@tanstack/react-query";
import { axiosInstance } from "../src/lib/axios";

const fetchPosts = async ({ pageParam = 1 }) => {
  const res = await axiosInstance.get(`/posts/feed?page=${pageParam}`);
  return res.data;
};

export const useInfinitePosts = () => {
  console.log("🧪 Página recibida:", lastPage); // dentro de useInfiniteQuery
  return useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: fetchPosts,
    getNextPageParam: (lastPage, pages) =>
      lastPage.hasMore ? pages.length + 1 : undefined,
  });
};
