// hooks/useChatListeners.js

import useJoinConversation from "./useConversationJoinSocket";
import useListenMessages from "./useListenMessages";
import useTypingListener from "./useTypingListener";

const useChatListeners = () => {
  useJoinConversation();
  useTypingListener();
  useListenMessages();
};

export default useChatListeners;
