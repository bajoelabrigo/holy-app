import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React from "react";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import { axiosInstance } from "../lib/axios";

const UserCard = ({ user, isConnection }) => {
  const queryClient = useQueryClient();
  const { mutate: removeConnection, isPending } = useMutation({
    mutationFn: (userId) => axiosInstance.delete(`/connections/${userId}`),
    onSuccess: () => {
      toast.success("Connection remove successfully");
      queryClient.invalidateQueries({
        queryKey: ["connectionRequests", user._id],
      });
    },
    onError: (error) => {
      const response =
        (error.response &&
          error.response.data &&
          error.response.data.message) ||
        error.message ||
        error.toString();
      toast.error(response);
    },
  });

  const handleRemoveConnection = () => {
    if (!window.confirm("Are you sure you want to delete connection")) return;
    removeConnection(user._id);
  };

  return (
    <div className="bg-base-100 text-base-content shadow p-4 flex flex-col items-center transition-all hover:shadow-md">
      <Link
        to={`/profile/${user.username}`}
        className="flex flex-col items-center"
      >
        <img
          src={user.profilePicture || "/avatar.png"}
          alt={user.name}
          className="w-24 h-24 rounded-full object-cover mb4"
        />
        <h3 className="font-semibold text-lg text-center">{user.username}</h3>
      </Link>
      <p className="text-gray-400 text-center">{user.headline}</p>
      <p className="text-sm text-info mt-2">
        {user?.connections?.length} connections
      </p>
      <button className="mt-4 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/80 transition-colors w-full">
        {isConnection ? "Connected" : "Connect"}
      </button>
      <button
        onClick={handleRemoveConnection}
        className="mt-4 bg-error text-white px-4 py-2 rounded-md hover:bg-error/80 transition-colors w-full"
      >
        {isPending ? "Loading..." : "Remove Connection"}
      </button>
    </div>
  );
};

export default UserCard;
