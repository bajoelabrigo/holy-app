import React from "react";
import { Link } from "react-router-dom";
import { useConnectionRequest } from "../../hooks/useConnectionRequest";

const FriendRequest = ({ request }) => {
  const { acceptConnectionRequest, rejectConnect, isRejectPending } =
    useConnectionRequest();

  return (
    <div className="bg-base-100 text-base-content rounded-lg shadow p-4 flex items-center justify-between transition-all hover:shadow-md">
      <div className="flex items-center gap-4">
        <Link to={`/profile/${request.sender.username}`}>
          <img
            src={request.sender.profilePicture || "/avatar.png"}
            alt={request.name}
            className="w-16 h-16 rounded-full object-cover"
          />
        </Link>
        <div>
          <Link
            to={`/profile/${request.sender.username}`}
            className="font-semibold text-lg"
          >
            {request.sender.name}
          </Link>
          <p className="text-gray-600">{request.sender.headline}</p>
        </div>
      </div>

      <div className="space-x-2">
        <button
          className="bg-neutral text-white px-4 py-2 rounded-md transition-colors hover:bg-neutral-700"
          onClick={() => acceptConnectionRequest(request._id)}
        >
          Accept
        </button>
        <button
          className="bg-base-300 text-base-content px-4 py-2 rounded-md transition-colors hover:bg-neutral-300"
          onClick={() => rejectConnect(request._id)}
        >
          {isRejectPending ? "cargando..." : "Reject"}
        </button>
      </div>
    </div>
  );
};

export default FriendRequest;
