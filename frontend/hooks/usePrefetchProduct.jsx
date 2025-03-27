import { useQueryClient } from "@tanstack/react-query";

const usePrefetchProduct = () => {
  const queryClient = useQueryClient();

  const preFetchProduct = () => {
    queryClient.prefetchQuery(["post", postId]);
  };
};

export default usePrefetchProduct;
