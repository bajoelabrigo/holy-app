import React from "react";
import useRedirectLoggedOutUser from "../../../hooks/useRedirectLoggedOutUser";
import { useSelector } from "react-redux";
import { usePost } from "../../../hooks/usePost";
import Sidebar from "../../components/Sidebar";
import PostCreation from "../../components/PostCreation";
import { Users } from "lucide-react";
import RecommendedUser from "../../components/RecommendedUser";
import Post from "../../components/Posts";

const Home = () => {
  useRedirectLoggedOutUser("/login");

  const { user } = useSelector((state) => state.auth);

  const { recommendedUsers, posts } = usePost();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="hidden lg:block lg:col-span-1">
        <Sidebar user={user} />
      </div>
      <div className="col-span-1 lg:col-span-2 order-first lg:order-none">
        {/*Create posts */}
        <PostCreation user={user} />
        <div>
          {posts?.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
        {/*Show if there is not post yet */}
        {posts?.length === 0 && (
          <div className="bg-base-100 text-base-content rounded-lg shadow-md p-8 text-center">
            <div className="mb-6">
              <Users size={64} className="mx-auto text-primary" />
            </div>
            <h2 className="text-2xl font-bold mb-4 text-base-content font-primary">
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
        </div>
      )}
    </div>
  );
};

export default Home;
