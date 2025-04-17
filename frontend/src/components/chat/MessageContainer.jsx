import React, { useEffect, useState } from "react";
import NoChatSelected from "./NoChatSelected";
import MessageInput from "./MessageInput";
import Messages from "./messages/Messages";
import useConversation from "../../../zustand/useConversation";
import FilesPreview from "./preview/files/FilesPreview";
import MessageHeader from "./MessageHeader";
import { useSearchMessages } from "../../../hooks/useSearchMessages";

const MessageContainer = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { selectedConversation, setSelectedConversation, files } =
    useConversation();

  const { data: searchData, isLoading: searching } = useSearchMessages({
    query: searchTerm,
    conversationId: selectedConversation?._id,
    page: 1,
  });

  const searchResults = searchData?.results || [];

  console.log("searchResults", searchResults)

  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  return (
    <div className="flex flex-col flex-1 max-w-6xl hview">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          <MessageHeader
            selectedConversation={selectedConversation}
            setSelectedConversation={setSelectedConversation}
            onSearch={setSearchTerm}
          />

          {files.length > 0 ? (
            <FilesPreview />
          ) : searchTerm ? (
            <div className="flex-1 overflow-y-auto px-4">
              {searching ? (
                <p className="text-center mt-4">Buscando mensajes...</p>
              ) : searchResults?.length > 0 ? (
                searchResults?.map((msg) => (
                  <div
                    key={msg._id}
                    className="p-2 bg-base-100 rounded mb-2 shadow flex items-center gap-6"
                  >
                    <img
                      src={msg.sender.profilePicture}
                      alt={msg.sender.profilePicture}
                      className="size-10 rounded-full overflow-hidden object-cover"
                    />
                    <div>
                      <p className="text-sm text-info">
                        {msg.sender.name} •{" "}
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                      <p>{msg.message}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center mt-4 text-gray-500">
                  No se encontraron mensajes.
                </p>
              )}
            </div>
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
