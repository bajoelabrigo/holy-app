import React, { useEffect } from "react";
import NoChatSelected from "./NoChatSelected";
import MessageInput from "./MessageInput";
import Messages from "./messages/Messages";
import useConversation from "../../../zustand/useConversation";
import FilesPreview from "./preview/files/FilesPreview";

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation, files } =
    useConversation();

  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  return (
    <div className="flex flex-col flex-1 max-w-6xl hview">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          <div className="bg-base-200 flex justify-between items-center px-4 py-2 mb-2 rounded-r-md">
            <div>
              <span className="label-text">To: </span>
              <span className=" font-bold">{selectedConversation?.name}</span>
            </div>
            {selectedConversation?.isGroup ? (
              <div className="relative w-12 h-12">
                <img
                  src={
                    selectedConversation?.participants?.[0]?.profilePicture ||
                    "/profile.png"
                  }
                  className="absolute w-8 h-8 rounded-full border-2 border-white z-10 top-2 -left-14 object-cover"
                />
                <img
                  src={
                    selectedConversation?.participants?.[1]?.profilePicture ||
                    "/profile.png"
                  }
                  className="absolute w-8 h-8 rounded-full border-2 border-white z-5  top-2 -left-10 object-cover"
                />
                <img
                  src={
                    selectedConversation?.participants?.[2]?.profilePicture ||
                    "/profile.png"
                  }
                  className="absolute w-8 h-8 rounded-full border-2 border-white z-3  top-2 -left-6 object-cover"
                />
                <img
                  src={
                    selectedConversation?.participants?.[3]?.profilePicture ||
                    "/profile.png"
                  }
                  className="absolute w-8 h-8 rounded-full border-2 border-white z-2  top-2 -left-2 object-cover"
                />
                <img
                  src={
                    selectedConversation?.participants?.[4]?.profilePicture ||
                    "/profile.png"
                  }
                  className="absolute w-8 h-8 rounded-full border-2 border-white z-0  top-2 left-2 object-cover"
                />
              </div>
            ) : (
              <img
                src={
                  selectedConversation?.participants?.profilePicture ||
                  "/avatar.png"
                }
                className="w-10 h-10 rounded-full object-cover"
                alt="profile"
              />
            )}
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
