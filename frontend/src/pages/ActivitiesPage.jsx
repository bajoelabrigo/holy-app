import React from "react";
import { usePost } from "../../hooks/usePost";
import RecommendedUser from "../components/RecommendedUser";
import { useSelector } from "react-redux";
import Activities from "../components/spiritualActivities/Acivities";
import Sidebar from "../components/Sidebar";

const ActivitiesPage = () => {
  const { recommendedUsers } = usePost({});
    const { user } = useSelector((state) => state.auth);
  
  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="hidden lg:block lg:col-span-1">
          <Sidebar user={user} />
        </div>
        <div className="col-span-1 lg:col-span-2 order-first lg:order-none">
          <Activities />
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
    </>
  );
};

export default ActivitiesPage;
