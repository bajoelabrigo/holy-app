import React from "react";
import useRedirectLoggedOutUser from "../../../hooks/useRedirectLoggedOutUser";
import { useSelector } from "react-redux";
import { usePost } from "../../../hooks/usePost";
import Sidebar from "../../components/Sidebar";
import PostCreation from "../../components/PostCreation";
import { Users } from "lucide-react";
import RecommendedUser from "../../components/RecommendedUser";
import Post from "../../components/Posts";
import { Link, useLocation } from "react-router-dom";
import EmailVerificationCard from "../../components/EmailVerificationCard";
import RandomVerse from "../../components/BibleRandomVerse";
import { useInView } from "react-intersection-observer";
import usePostSocketNotifications from "../../../hooks/usePostSocketNotifications";
import { useSearchPosts } from "../../../hooks/useSearchPosts";

// Función utilitaria para leer query string
function useQueryParam(key) {
  const { search } = useLocation();
  const params = new URLSearchParams(search);
  return params.get(key);
}

const Home = () => {
  useRedirectLoggedOutUser("/login");

  const { user } = useSelector((state) => state.auth);
  usePostSocketNotifications(user);

  const search = useQueryParam("search");
  const { data: searchResults, isLoading: isLoadingSearch } =
    useSearchPosts(search);

  const {
    posts,
    recommendedUsers,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    data,
  } = usePost();

  const { ref, inView } = useInView({
    threshold: 1,
    rootMargin: "0px 0px 200px 0px",
  });

  React.useEffect(() => {
    if (inView && hasNextPage && !search) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage, search]);

  return (
    <>
      <EmailVerificationCard user={user} />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="hidden lg:block lg:col-span-1">
          <Sidebar user={user} />
          <RandomVerse />
        </div>

        <div className="col-span-1 lg:col-span-2 order-first lg:order-none">
          <PostCreation user={user} />

          <div>
            {/* Si hay una búsqueda activa, mostrar resultados */}
            {search ? (
              <>
                <h2 className="text-xl font-bold mb-4">
                  Resultados para:{" "}
                  <span className="text-primary">{search}</span>
                </h2>

                {isLoadingSearch ? (
                  <p className="text-center text-info">Buscando...</p>
                ) : searchResults?.length > 0 ? (
                  searchResults.map((post) => (
                    <Post key={post._id} post={post} />
                  ))
                ) : (
                  <p className="text-center text-info">
                    No se encontraron publicaciones.
                  </p>
                )}
              </>
            ) : (
              // Si no hay búsqueda, mostrar el feed con scroll infinito
              <>
                {data?.pages.map((page, i) => (
                  <React.Fragment key={i}>
                    {page.map((post) => (
                      <Post key={post._id} post={post} />
                    ))}
                  </React.Fragment>
                ))}
                <div ref={ref} className="text-center py-4">
                  {isFetchingNextPage && (
                    <span className="loading loading-spinner text-info" />
                  )}
                  {!hasNextPage && (
                    <p className="text-info">No hay más publicaciones.</p>
                  )}
                </div>
              </>
            )}
          </div>

          {!search && posts?.length === 0 && (
            <div className="bg-base-100 text-base-content rounded-lg shadow-md p-8 text-center">
              <div className="mb-6">
                <Users size={64} className="mx-auto text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4 font-primary">
                No hay publicaciones aún
              </h2>
              <p className="mb-6 text-gray-500">
                Conecta con otros para empezar a ver publicaciones en tu feed.
              </p>
            </div>
          )}
        </div>

        {recommendedUsers?.length > 0 && (
          <div className="col-span-1 lg:col-span-1 hidden lg:block">
            <div className="rounded-lg shadow-lg p-4 bg-base-100 text-base-content">
              <h2 className="font-semibold mb-4">
                Personas que podrías conocer
              </h2>
              {recommendedUsers.map((user) => (
                <RecommendedUser key={user._id} user={user} />
              ))}
            </div>
            <Link to="/activities">
              <img
                src="/actividades.png"
                alt="Actividades"
                className="mt-6 rounded-lg"
              />
            </Link>
            <Link to="/bible">
              <img src="/biblia.png" alt="Biblia" className="mt-6 rounded-lg" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
