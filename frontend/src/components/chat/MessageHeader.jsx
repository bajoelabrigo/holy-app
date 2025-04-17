import React, { useState } from "react";
import { Search } from "lucide-react";

const MessageHeader = ({ selectedConversation, onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearch && searchTerm.trim()) {
      onSearch(searchTerm.trim());
    }
  };

  return (
    <div className="bg-base-200 flex flex-col gap-2 px-4 py-2 mb-2 rounded-r-md">
      <div className="flex justify-between items-center">
        <div>
          <span className="label-text">To: </span>
          <span className=" font-bold">{selectedConversation?.name}</span>
        </div>

        {selectedConversation?.isGroup ? (
          <div className="relative w-12 h-12">
            {selectedConversation?.participants?.slice(0, 5).map((p, index) => (
              <img
                key={index}
                src={p?.profilePicture || "/profile.png"}
                className={`absolute w-8 h-8 rounded-full border-2 border-white z-${
                  10 - index
                } top-2 left-${index * 4}`}
                style={{ left: `${index * 12}px` }}
                alt="profile"
              />
            ))}
          </div>
        ) : (
          <img
            src={
              selectedConversation?.participants?.[0]?.profilePicture ||
              "/avatar.png"
            }
            className="w-10 h-10 rounded-full object-cover"
            alt="profile"
          />
        )}
      </div>

      {/* 🔍 Buscador */}
      <form
        onSubmit={handleSearchSubmit}
        className="flex items-center gap-2 mt-1"
      >
        <input
          type="text"
          placeholder="Buscar mensajes..."
          className="input input-sm input-bordered flex-1"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <button type="submit" className="btn btn-sm btn-ghost">
          <Search size={18} />
        </button>
      </form>
    </div>
  );
};

export default MessageHeader;
