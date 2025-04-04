import React from "react";
import { usePost } from "../../hooks/usePost";
import RecommendedUser from "../components/RecommendedUser";
import { MessageContainer } from "../components/chat";
import SidebarChat from "../components/chat/sidebar/Sidebar";
import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux";
import useRedirectLoggedOutUser from "../../hooks/useRedirectLoggedOutUser";

const ChatPage = () => {
  useRedirectLoggedOutUser("/login");
  const { recommendedUsers } = usePost({});
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
      <div className="hidden xl:block xl:col-span-1">
        <Sidebar user={user} />
      </div>
      <div className="hidden xl:block xl:col-span-1 ">
        <div className="bg-base-100 flex rounded-lg shadow p-4 mb-6  ">
          <SidebarChat />
        </div>
      </div>
      <div className="col-span-6 xl:col-span-2 order-first lg:order-none">
        <MessageContainer />
      </div>
      {recommendedUsers?.length > 0 && (
        <div className="col-span-1 xl:col-span-1 hidden xl:block">
          <div className="bg-base-100 rounded-lg shadow p-4">
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

export default ChatPage;
