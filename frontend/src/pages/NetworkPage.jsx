import { useSelector } from "react-redux";
import Sidebar from "../components/Sidebar";
import FriendRequest from "../components/FriendRequest";
import { UserPlus } from "lucide-react";
import UserCard from "../components/UserCard";
import { useConnectionRequest } from "../../hooks/useConnectionRequest";

const NetworkPage = () => {
  const { user } = useSelector((state) => state.auth);

  const { connectionRequest, connections } = useConnectionRequest();

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      <div className="col-span-1 lg:col-span-1">
        <Sidebar user={user} />
      </div>
      <div className="col-span-1 lg:col-span-3">
        <div className="bg-base-200 text-base-content rounded-lg shadow-lg p-6 mb-6">
          <h1 className="text-2xl font-bold mb-6">My Network</h1>

          {connectionRequest?.data?.length > 0 ? (
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-2">Connection Request</h2>
              <div className="space-y-4">
                {connectionRequest.data.map((request) => (
                  <FriendRequest key={request._id} request={request} />
                ))}
              </div>
            </div>
          ) : (
            <div className="bg-base-100 text-base-content rounded-lg shadow p-6 text-center mb-6">
              <UserPlus size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-xl font-semibold mb-2">
                No Connection Requests
              </h3>
              <p className="text-gray-600 mt-2">
                Explore suggested connections bellow to expand your nectwork
              </p>
            </div>
          )}

          {connections?.data?.map((connection) => (
            <UserCard
              key={connection._id}
              user={connection}
              isConnection={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default NetworkPage;
