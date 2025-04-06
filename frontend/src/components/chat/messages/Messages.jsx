import React, { useEffect, useRef } from "react";
import Message from "./Message";
import MessageSkeleton from "./MessageSkeleton";
import { UserRoundPen } from "lucide-react";
import useGetMessages from "../../../../hooks/useGetMessages";
import useListenMessages from "../../../../hooks/useListenMessages";
import FileMessage from "../files/FileMessage";
import { useSelector } from "react-redux";

const Messages = () => {
  const { loading, messages } = useGetMessages();
  const { user } = useSelector((state) => state.auth);

  //SOCKET TO MESSAGE
  useListenMessages();

  //MOVE SCROLL AFTER EVERY MESSAGE
  const lastMessageRef = useRef();
  useEffect(() => {
    setTimeout(() => {
      lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  }, [messages]);

  return (
    <div className="px-4 flex-1 overflow-auto">
      {!loading &&
        messages?.length > 0 &&
        messages?.map((message) => (
          <div key={message._id}>
            {/*Message files */}
            {message?.files?.length > 0
              ? message.files.map((file, i) => (
                  <FileMessage
                    key={`${message._id}-${i}`} // clave única combinada
                    FileMessage={file}
                    message={message}
                    me={user?._id === message?.senderId}
                  />
                ))
              : null}
            {message?.message?.length > 0 ? (
              <Message message={message} />
            ) : null}

            <div ref={lastMessageRef}></div>
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
    </div>
  );
};

export default Messages;
