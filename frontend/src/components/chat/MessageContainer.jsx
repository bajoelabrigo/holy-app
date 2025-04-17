import React, { useEffect, useRef, useState } from "react";
import NoChatSelected from "./NoChatSelected";
import MessageInput from "./MessageInput";
import Messages from "./messages/Messages";
import useConversation from "../../../zustand/useConversation";
import FilesPreview from "./preview/files/FilesPreview";
import MessageHeader from "./MessageHeader";
import { useSearchMessages } from "../../../hooks/useSearchMessages";

const MessageContainer = () => {
  const [scrollToId, setScrollToId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const resultBoxRef = useRef(null);
  const { selectedConversation, setSelectedConversation, files } =
    useConversation();

  const { data: searchData, isLoading: searching } = useSearchMessages({
    query: searchTerm,
    conversationId: selectedConversation?._id,
    page: 1,
  });

  const searchResults = searchData?.results || [];

  //console.log("searchResults", searchResults);

  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (resultBoxRef.current && !resultBoxRef.current.contains(e.target)) {
        setSearchTerm(""); // Cierra la búsqueda
      }
    };

    const handleEscape = (e) => {
      if (e.key === "Escape") {
        setSearchTerm(""); // Cierra con ESC
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

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
              <div
                ref={resultBoxRef}
                className="flex-1 overflow-y-auto px-4 relative"
              >
                <button
                  className="absolute top-2 right-2 text-sm text-gray-400 hover:text-red-500"
                  onClick={() => setSearchTerm("")}
                >
                  ✕
                </button>
              </div>
              {searching ? (
                <p className="text-center mt-4">Buscando mensajes...</p>
              ) : searchResults?.length > 0 ? (
                searchResults?.map((msg) => (
                  <div
                    key={msg._id}
                    className="p-2 bg-base-100 rounded mb-2 shadow cursor-pointer hover:bg-primary/10 flex gap-4"
                    onClick={() => {
                      setScrollToId(msg._id); // <- establecer el ID a enfocar
                      setSearchTerm(""); // <- volver al modo normal de mensajes
                    }}
                  >
                    <div className="size-14">
                      <img
                        src={msg.sender.profilePicture}
                        alt={msg.sender.profilePicture}
                        className="w-14 h-14 rounded-full overflow-hidden object-cover "
                      />
                    </div>

                    <div>
                      <p className="text-sm text-info">
                        {msg.sender.name} •{" "}
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                      <p className="bg-success text-white rounded-sm px-4 py-1 w-full">
                        {msg.message}
                      </p>
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
              <Messages scrollToId={scrollToId} />
              <MessageInput />
            </>
          )}
        </>
      )}
    </div>
  );
};

export default MessageContainer;
