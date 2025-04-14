import useConversation from "../../../../zustand/useConversation";
import { useSocketContext } from "../../../../context/SocketContext";

const Conversation = ({ conversation, lastIdx }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?._id === conversation._id;
  const { onlineUsers } = useSocketContext();
  const isOnline = onlineUsers.includes(conversation._id);

  return (
    <>
      <div
        className={`flex gap-2 items-center rounded p-2 py-1 cursor-pointer ${
          isSelected ? "bg-blue-900 " : ""
        }`}
        onClick={() => setSelectedConversation(conversation)}
      >
        <div className={`rounded-full  ${isOnline ? "online" : "offline"}`}>
          {conversation.isGroup ? (
            <div className="relative w-12 h-12">
              <img
                src={
                  conversation.participants?.[0]?.profilePicture ||
                  "/avatar.png"
                }
                className="absolute w-8 h-8 rounded-full border-2 border-white z-10 top-0 left-0 object-cover"
              />
              <img
                src={
                  conversation.participants?.[1]?.profilePicture ||
                  "/avatar.png"
                }
                className="absolute w-8 h-8 rounded-full border-2 border-white z-0 top-2 left-2 object-cover"
              />
            </div>
          ) : (
            <div
              className={`rounded-full avatar ${
                isOnline ? "online" : "offline"
              }`}
            >
              <div className="w-12 h-12 rounded-full object-cover overflow-hidden">
                <img src={conversation.profilePicture || "/avatar.png"} />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between">
            <p
              className={`font-bold text-base-content ${
                isSelected ? "text-white" : ""
              }`}
            >
              {conversation.name}
            </p>
            <span className="text-xl"></span>
            <p className={`${isOnline ? "text-success" : "text-error"}`}>
              {isOnline ? "online" : "offline"}
            </p>
          </div>
          <p
            className={`font-extralight text-gray-400 ${
              isSelected ? "text-gray-400" : ""
            }`}
          >
            {conversation.status}
          </p>
        </div>
      </div>

      {!lastIdx && <div className="divider my-0 py-0 h-1" />}
    </>
  );
};

export default Conversation;
