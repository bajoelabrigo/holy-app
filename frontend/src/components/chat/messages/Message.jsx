import React from "react";
import useConversation from "../../../../zustand/useConversation";
import { useSelector } from "react-redux";
import { extractTime } from "../../../utils/extractTime";

const Message = ({ message }) => {
  const { user: authUser } = useSelector((state) => state.auth);
  const { selectedConversation } = useConversation();

  const fromMe =
    String(message.senderId?._id || message.senderId) === String(authUser?._id);
    
  const formattedTime = extractTime(message?.createdAt);

  const chatClassName = fromMe ? "chat chat-end" : "chat chat-start";
  const profilePic = fromMe
    ? authUser.profilePicture || "/avatar.png"
    : selectedConversation?.profilePicture || "/avatar.png";
  const bubbleBgColor = fromMe ? "bg-blue-500" : "bg-purple-500";

  const shakeClass = message?.shouldShake ? "shake" : "";

  return (
    <div className={`chat ${chatClassName} mb-2`}>
      <div className="chat-image avatar">
        <div className="size-10 rounded-full">
          <img src={profilePic} alt="" />
        </div>
      </div>
      <div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass}`}>
        {message.message}
      </div>

      <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">
        {formattedTime}
      </div>
    </div>
  );
};

export default Message;
