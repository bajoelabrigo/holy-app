import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getMessagesChat, getUsersChat, sendMessageChat } from "./chatService";

export const useChat = () => {
  const queryClient = useQueryClient();
  const [selectedUser, setSelectedUser] = useState(null);

  const { data: getUsers } = useQuery({
    queryKey: ["users"],
    queryFn: getUsersChat,
  });

  const { data: getMessages } = useQuery({
    queryKey: ["messages", selectedUser?._id],
    queryFn: () => getMessagesChat(selectedUser?._id),
    enabled: !!selectedUser, // Solo se ejecuta si selectedUser está definido
  });

  const { mutate: sendMessage } = useMutation({
    mutationKey: ["messages", selectedUser],
    mutationFn: (messageData) => sendMessageChat(messageData, selectedUser),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["messages"] });
    },
    onError: (err) => {
      handleError(err);
    },
  });

  return { getUsers, getMessages, sendMessage, setSelectedUser };
};
