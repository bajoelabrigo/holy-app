import React, { useEffect, useRef } from "react";
import Message from "./Message";
import MessageSkeleton from "./MessageSkeleton";
import { UserRoundPen } from "lucide-react";
import useGetMessages from "../../../../hooks/useGetMessages";

import FileMessage from "../files/FileMessage";
import { useSelector } from "react-redux";
import TypingIndicator from "./typing";
import useConversation from "../../../../zustand/useConversation";
import useChatListeners from "../../../../hooks/useChatListeners";

const Messages = ({ scrollToId }) => {
  const { loading, messages } = useGetMessages();
  const { user } = useSelector((state) => state.auth);
  const { selectedConversation, typingStatus } = useConversation();
  const typingUser = typingStatus[selectedConversation?._id];

  useChatListeners();

  useEffect(() => {
    if (scrollToId) {
      const target = document.getElementById(`msg-${scrollToId}`);
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });

        target.classList.add("bg-yellow-100", "transition-colors");

        const timeout = setTimeout(() => {
          target.classList.remove("bg-yellow-100");
        }, 3000);

        return () => clearTimeout(timeout);
      }
    }
  }, [scrollToId]);

  useEffect(() => {
    if (scrollToId) {
      const el = document.getElementById(`msg-${scrollToId}`);
      el?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, [scrollToId]);

  // Scroll automático al último mensaje
  const lastMessageRef = useRef();
  useEffect(() => {
    if (!scrollToId) {
      setTimeout(() => {
        lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages, scrollToId]);

  return (
    <div className="px-4 flex-1 overflow-auto">
      {!loading &&
        messages?.length > 0 &&
        messages?.map((message) => (
          <div key={message._id}>
            {/* Archivos del mensaje */}
            {message?.files?.length > 0
              ? message.files.map((file, i) => (
                  <FileMessage
                    key={`${message._id}-${i}`}
                    FileMessage={file}
                    message={message}
                    me={user?._id === message?.senderId}
                  />
                ))
              : null}

            {/* Texto del mensaje */}
            {message?.message?.length > 0 ? (
              <Message message={message} scrollToId={scrollToId} />
            ) : null}

            <div ref={lastMessageRef} className="mb10"></div>
          </div>
        ))}

      {loading && [...Array(4)].map((_, idx) => <MessageSkeleton key={idx} />)}

      {!loading && messages.length === 0 && (
        <div className="flex flex-col items-center justify-center h-full">
          <UserRoundPen className="text-sky-500" size={60} />
          <p className="text-center text-2xl font-semibold text-gray-500">
            Send a message to start the conversation
          </p>
        </div>
      )}

      {/* 👇 Mensaje de typing */}
      <div className="mb-20">
        {typingUser && <TypingIndicator name={typingUser} />}
      </div>
    </div>
  );
};

export default Messages;
