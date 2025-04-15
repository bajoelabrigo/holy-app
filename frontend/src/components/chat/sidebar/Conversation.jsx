import useConversation from "../../../../zustand/useConversation";
import { useEffect } from "react";
import { createConversation } from "../../../../hooks/chatService";
import useIsConversationOnline from "../../../../hooks/useIsConversationOnline";

const Conversation = ({ conversation, lastIdx }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const isSelected = selectedConversation?._id === conversation._id;

  const isOnline = useIsConversationOnline(conversation);

  useEffect(() => {
    if (conversation && conversation._id !== selectedConversation?._id) {
      setSelectedConversation(conversation);
    }
  }, [conversation?._id]);

  const handleClick = async () => {
    if (conversation._id) {
      setSelectedConversation(conversation);
    } else if (conversation.userId) {
      try {
        const newConv = await createConversation(conversation.userId);
        if (newConv?._id) {
          setSelectedConversation(newConv);
        } else {
          toast.error("No se pudo crear la conversación.");
        }
      } catch (error) {
        console.error("Error creando conversación:", error);
        toast.error("Error creando conversación.");
      }
    } else {
      toast.error("No se puede iniciar conversación con este usuario.");
    }
  };

  return (
    <>
      <div
        className={`flex gap-2 items-center rounded p-2 py-1 cursor-pointer transition ${
          isSelected
            ? "bg-blue-900"
            : "hover:bg-base-200 dark:hover:bg-base-300"
        }`}
        onClick={handleClick}
      >
        <div className="rounded-full">
          {conversation.isGroup ? (
            <div className="relative w-12 h-12">
              {[0, 1, 2].map((index) => (
                <img
                  key={index}
                  src={
                    conversation.participants?.[index]?.profilePicture ||
                    "/avatar.png"
                  }
                  className={`absolute w-8 h-8 rounded-full border-2 border-white object-cover ${
                    index === 0
                      ? "z-10 top-0 left-0"
                      : index === 1
                      ? "z-5 top-2 left-2"
                      : "z-0 top-4 left-4"
                  }`}
                />
              ))}
            </div>
          ) : (
            <div
              className={`avatar rounded-full ${
                isOnline ? "online" : "offline"
              }`}
            >
              <div className="w-12 h-12 rounded-full overflow-hidden">
                <img
                  src={conversation?.profilePicture || "/profile.png"}
                  alt="User"
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col flex-1">
          <div className="flex justify-between items-center">
            <p
              className={`font-bold ${
                isSelected ? "text-white" : "text-base-content"
              }`}
            >
              {conversation.name}
            </p>
            <p
              className={`text-xs font-semibold ${
                isOnline ? "text-success" : "text-error"
              }`}
            >
              {isOnline ? "online" : "offline"}
            </p>
          </div>
          <p
            className={`text-sm truncate ${
              isSelected ? "text-gray-300" : "text-base-content"
            }`}
          >
            {conversation.status || "Conversación"}
          </p>
        </div>
      </div>

      {!lastIdx && <div className="divider my-0 py-0 h-1" />}
    </>
  );
};

export default Conversation;
