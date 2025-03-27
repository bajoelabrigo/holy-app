import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { axiosInstance } from "../src/lib/axios";
import { useSelector } from "react-redux";

export const useConnectionRequest = () => {
  const queryClient = useQueryClient();
  const { user } = useSelector((state) => state.auth);

  const { mutate: acceptConnectionRequest } = useMutation({
    mutationFn: (requestId) =>
      axiosInstance.put(`/connections/accept/${requestId}`),
    onSuccess: () => {
      toast.success("Connection Request accepted");
      queryClient.invalidateQueries({ queryKey: ["connectionRequests",] });
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

  const { mutate: rejectConnect, isRejectPending } = useMutation({
    mutationFn: (requestId) =>
      axiosInstance.put(`/connections/reject/${requestId}`),
    onSuccess: () => {
      toast.success("Connection Reject accepted");
      queryClient.invalidateQueries({ queryKey: ["connectionRequests", user?._id] });
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

  const { data: connectionRequest } = useQuery({
    queryKey: ["connectionRequest", user?._id],
    queryFn: () => axiosInstance.get("/connections/request"),
  });

  const { data: connections } = useQuery({
    queryKey: ["connections", user?._id],
    queryFn: () => axiosInstance.get("/connections"),
  });

  const { mutate: removeConnection, isPending: isRemovePending } = useMutation({
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

  return {
    acceptConnectionRequest,
    rejectConnect,
    isRejectPending,
    connections,
    connectionRequest,
    removeConnection,
    isRemovePending,
  };
};
