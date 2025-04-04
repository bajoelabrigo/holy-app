import React from "react";
import useGetConversations from "../../../../hooks/useGetConversations";
import useConversation from "../../../../zustand/useConversation";
import { useSocketContext } from "../../../../context/SocketContext";

const Contact = ({ contact }) => {
  const { loading, conversations } = useGetConversations();
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(contact?._id);

  const isSelected = selectedConversation?._id === contact?._id;

  return (
    <li
      className={`list-none mt-1 h-[90px] ${
        isSelected ? "bg-blue-900" : ""
      } cursor-pointer 
    px-[10px]`}
      onClick={() => setSelectedConversation(contact)}
    >
      {/*Container */}
      <div className="flex items-center gap-x-3 py-[10px]">
        {/*Contact infos */}
        <div className="flex items-center gap-x-3">
          {/*Conversation user picture*/}
          <div className="relative min-w-[50px] max-w-[50px] h-[50px] rounded-full overflow-hidden">
            <img
              src={contact?.profilePicture}
              alt={contact?.name}
              className="w-full h-full object-cover"
            />
          </div>
          {/*Conversation name and message*/}
          <div className="w-full flex flex-col">
            {/*Conversation name*/}
            <div className="flex gap-3 justify-between">
              <h1
                className={`font-bold text-base-content ${
                  isSelected ? "text-white" : ""
                }`}
              >
                {contact?.name}
              </h1>
              <p className={`${isOnline ? "text-success" : "text-error"}`}>
                {isOnline ? "online" : "offline"}
              </p>
            </div>
            {/* Conversation status */}
            <div>
              <div className="flex items-center gap-x-1 ">
                <div className="flex-1 items-center gap-x-1 text-base-content font-extralight">
                  <p
                    className={`font-extralight text-base-content ${
                      isSelected ? "text-white" : ""
                    }`}
                  >
                    {contact?.status}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/*Border*/}
      <div className="ml-16 mt-6 border-b "></div>
    </li>
  );
};

export default Contact;
