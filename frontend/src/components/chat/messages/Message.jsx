import React, { useState } from "react";
import useConversation from "../../../../zustand/useConversation";
import { useSelector } from "react-redux";
import { extractTime } from "../../../utils/extractTime";
import extractLinks from "../../../utils/extraLinks";
import Microlink from "@microlink/react";
import useGetMessages from "../../../../hooks/useGetMessages";

const Message = ({ message }) => {
  const { user: authUser } = useSelector((state) => state.auth);
  const { selectedConversation, typingStatus } = useConversation();
  const { deleteMessage, editMessage } = useGetMessages();

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message.message);

  const content = message.message;
  const { links, originalString } = extractLinks(content);

  const fromMe =
    String(message.senderId?._id || message.senderId) === String(authUser?._id);
  const formattedTime = extractTime(message?.createdAt);
  const chatClassName = fromMe ? "chat chat-end" : "chat chat-start";
  const profilePic = message.senderId?.profilePicture || "/avatar.png";
  const bubbleBgColor = fromMe ? "bg-blue-500" : "bg-purple-500";
  const shakeClass = message?.shouldShake ? "shake" : "";

  const handleDelete = () => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este mensaje?"
    );
    if (confirmed) {
      deleteMessage(message._id);
    }
  };
  const handleEdit = async () => {
    await editMessage(message._id, editedText);
    setIsEditing(false);
  };

  return (
    <div className={`chat ${chatClassName} mb-2`}>
      <div className="chat-image avatar">
        <div className="size-10 rounded-full">
          <img src={profilePic} alt="" />
        </div>
      </div>

      <div className={`chat-bubble text-white ${bubbleBgColor} ${shakeClass}`}>
        {links.length > 0 && !isEditing && (
          <Microlink style={{ width: "100%" }} url={links[0]} />
        )}

        {isEditing ? (
          <div className="flex flex-col gap-2">
            <textarea
              className="text-black p-2 rounded bg-white"
              value={editedText}
              onChange={(e) => setEditedText(e.target.value)}
            />
            <div className="flex justify-end gap-2 text-xs">
              <button
                onClick={handleEdit}
                className="px-2 py-1 bg-green-600 rounded text-white"
              >
                Guardar
              </button>
              <button
                onClick={() => {
                  setIsEditing(false);
                  setEditedText(message.message);
                }}
                className="px-2 py-1 bg-gray-500 rounded text-white"
              >
                Cancelar
              </button>
            </div>
          </div>
        ) : (
          <p
            dangerouslySetInnerHTML={{ __html: originalString }}
            className="float-left h-full min-w-full pb-4 pr-8"
          />
        )}
      </div>

      <div className="chat-footer text-xs flex justify-between items-center gap-4">
        <span>{formattedTime}</span>

        {fromMe && (
          <div className="flex gap-2">
            <button
              onClick={() => setIsEditing(true)}
              className="text-info hover:underline"
            >
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="text-red-400 hover:underline"
            >
              Eliminar
            </button>
          </div>
        )}

        {!fromMe && selectedConversation?.isGroup && (
          <div className="text-xs font-semibold">{message.senderId?.name}</div>
        )}
      </div>
    </div>
  );
};

export default Message;
