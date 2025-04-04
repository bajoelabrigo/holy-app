import React, { useEffect } from "react";
import NoChatSelected from "./NoChatSelected";
import MessageInput from "./MessageInput";
import Messages from "./messages/Messages";
import useConversation from "../../../zustand/useConversation";
import FilesPreview from "./files/FilesPreview";
import useSendMessage from "../../../hooks/useSendMessage";

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation, files } =
    useConversation();

  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  return (
    <div className="flex flex-col flex-1 max-w-6xl h-[calc(100vh-20rem)]">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          <div className="bg-base-200  flex justify-between items-center px-4 py-2 mb-2 rounded-r-md">
            <div>
              <span className="label-text">To: </span>
              <span className=" font-bold">{selectedConversation?.name}</span>
            </div>
            <img
              src={selectedConversation?.profilePicture || "/avatar.png"}
              className="w-10 h-10 rounded-full object-cover"
              alt="profile"
            />
          </div>

          {files.length > 0 ? (
            <FilesPreview />
          ) : (
            <>
              <Messages />
              <MessageInput />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MessageContainer;
