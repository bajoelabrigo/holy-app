import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import { getRecommendedUsers } from "./PostService";
import { axiosInstance } from "../src/lib/axios";

export const usePost = () => {
  // 1. Obtener usuarios recomendados
  const { data: recommendedUsers } = useQuery({
    queryKey: ["recommendedUsers"],
    queryFn: getRecommendedUsers,
    staleTime: 1000 * 60 * 60,
  });

  // 2. Obtener posts con scroll infinito
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: async ({ pageParam = 1 }) => {
      const res = await axiosInstance.get(`/posts?page=${pageParam}&limit=2`);
      return res.data; // ✅ Asegúrate de devolver SOLO el array
    },
    getNextPageParam: (lastPage, allPages) => {
      //console.log("🧭 Última página recibida:", lastPage);
      //console.log("🧭 Cantidad de páginas acumuladas:", allPages.length);

      if (lastPage.length < 2) {
        //console.log("🛑 No hay más publicaciones que cargar.");
        return undefined;
      }

      const nextPage = allPages.length + 1;
      //console.log("🔁 Próxima página:", nextPage);
      return nextPage;
    },
    refetchInterval: 5000, // cada 10 segundos
  });

  return {
    recommendedUsers,
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  };
};
