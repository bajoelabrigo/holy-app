import React from "react";
import useRedirectLoggedOutUser from "../../../hooks/useRedirectLoggedOutUser";
import { useSelector } from "react-redux";
import { usePost } from "../../../hooks/usePost";
import Sidebar from "../../components/Sidebar";
import PostCreation from "../../components/PostCreation";
import { Users } from "lucide-react";
import RecommendedUser from "../../components/RecommendedUser";
import Post from "../../components/Posts";
import { Link } from "react-router-dom";
import EmailVerificationCard from "../../components/EmailVerificationCard";
import RandomVerse from "../../components/BibleRandomVerse";
import { useInView } from "react-intersection-observer";
import usePostSocketNotifications from "../../../hooks/usePostSocketNotifications";


const Home = () => {
  useRedirectLoggedOutUser("/login");

  const { user } = useSelector((state) => state.auth);

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

  usePostSocketNotifications(user);

  const { ref, inView } = useInView({
    threshold: 1,
    rootMargin: "0px 0px 200px 0px", // detecta más pronto
  });

  // 🔄 Detectar cuando llega al final y cargar más
  React.useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

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
            {data?.pages?.map((page, i) => (
              <React.Fragment key={i}>
                {page?.map((post) => (
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
          </div>

          {posts?.length === 0 && (
            <div className="bg-base-100 text-base-content rounded-lg shadow-md p-8 text-center">
              <div className="mb-6">
                <Users size={64} className="mx-auto text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-4 font-primary">
                No Posts Yet
              </h2>
              <p className="mb-6 text-gray-500">
                Connect with others to start seeing posts in your feed!
              </p>
            </div>
          )}
        </div>

        {recommendedUsers?.length > 0 && (
          <div className="col-span-1 lg:col-span-1 hidden lg:block">
            <div className="rounded-lg shadow-lg p-4 bg-base-100 text-base-content">
              <h2 className="font-semibold mb-4">People you may know</h2>
              {recommendedUsers?.map((user) => (
                <RecommendedUser key={user._id} user={user} />
              ))}
            </div>
            <Link to="/activities">
              <img src="/actividades.png" alt="" className="mt-6 rounded-lg" />
            </Link>
            <Link to="/bible">
              <img src="/biblia.png" alt="" className="mt-6 rounded-lg" />
            </Link>
          </div>
        )}
      </div>
    </>
  );
};

export default Home;
