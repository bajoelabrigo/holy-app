import { useQuery } from "@tanstack/react-query";
import { getconnectionRequests, getNotifications } from "./navbarService";
import { useSelector } from "react-redux";

export const useNavbar = () => {
  const { user } = useSelector((state) => state.auth);

  const { data: notifications } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => getNotifications(),
    enabled: !!user,
  });

  const { data: connectionRequests } = useQuery({
    queryKey: ["connectionRequests"],
    queryFn: async () => getconnectionRequests(),
    enabled: !!user,
  });

  return { notifications, connectionRequests };
};
