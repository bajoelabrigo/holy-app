import {  useQuery } from "@tanstack/react-query";
import {  getPosts, getRecommendedUsers } from "./PostService";

export const usePost = () => {
  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => getRecommendedUsers(),
  });

  const { data: posts } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => getPosts(),
  });

  return { recommendedUsers, posts };
};
