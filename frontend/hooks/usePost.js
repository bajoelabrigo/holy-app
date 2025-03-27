import { useQuery } from "@tanstack/react-query";
import { getPosts, getRecommendedUsers } from "./PostService";

export const usePost = ({ filterKey }) => {
  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: async () => getRecommendedUsers(),
    staleTime: 1000 * 60 * 60,
  });

  const {
    data: posts = [],
    isLoading,
    isError,
    isFetching,
  } = useQuery({
    queryKey: ["posts", { filterKey }],
    queryFn: async () => getPosts({ filterKey }),
    staleTime: 1000 * 60 * 60,
  });

  return { recommendedUsers, posts, isLoading, isError, isFetching };
};
