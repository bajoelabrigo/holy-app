import { Download } from "lucide-react";
import React, { useState } from "react";
import FileImageVideo from "./FileImageVideo";
import FileOthers from "./FileOthers";
import moment from "moment";
import useConversation from "../../../../zustand/useConversation";
import { useSelector } from "react-redux";
import { extractTime } from "../../../utils/extractTime";
import toast from "react-hot-toast";
import useGetMessages from "../../../../hooks/useGetMessages";

const FileMessage = ({ FileMessage, message }) => {
  const { file, type } = FileMessage;
  const { user: authUser } = useSelector((state) => state.auth);
  const { selectedConversation } = useConversation();

  const { deleteMessage, editMessage } = useGetMessages();

  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(message?.message || "");

  const fromMe =
    String(message.senderId?._id || message.senderId) === String(authUser?._id);

  const formattedTime = extractTime(message?.createdAt);

  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const profilePic = message.senderId?.profilePicture || "/avatar.png";

  const handleDownloadClick = () => {
    const link = document.createElement("a");
    link.href = file.secure_url;
    link.setAttribute("download", file.original_filename || "file");
    link.setAttribute("target", "_self");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDelete = () => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar este mensaje?"
    );
    if (confirmed) {
      deleteMessage(message._id);
    }
  };

  const handleEdit = async () => {
    if (!editedText.trim())
      return toast.error("El mensaje no puede estar vacío");
    await editMessage(message._id, editedText);
    setIsEditing(false);
  };

  return (
    <div
      className={`flex mt-3 space-x-3 max-w-xs z-10 mb-2  ${
        fromMe ? "ml-auto justify-end " : ""
      }`}
    >
      <div className="relative flex space-x-12">
        {!fromMe && (
          <div className="chat-image avatar size-10 rounded-full ">
            <img
              src={profilePic || "/avatar.png"}
              alt=""
              className="rounded-full object-cover ml-10"
            />
          </div>
        )}

        <div
          className={`relative h-full dark:text-dark_text_1 rounded-xl
        ${fromMe ? " bg-blue-500" : "bg-purple-500"}
        ${
          fromMe && file?.public_id?.split(".")[1] === "png"
            ? "bg-white"
            : "bg-green_3 px-2 pt-2 pb-6 rounded-tr-none"
        }`}
        >
          <div
            className={`h-full text-sm ${
              type !== "IMAGE" && (type !== "VIDEO") !== "AUDIO" ? "pb-5" : ""
            }`}
          >
            {type === "IMAGE" || type === "VIDEO" || type === "AUDIO" ? (
              <FileImageVideo url={file?.secure_url} type={type} />
            ) : (
              <FileOthers file={file} type={type} me={fromMe} />
            )}
          </div>
          <span className="absolute right-1.5 bottom-1 text-xs leading-none">
            {moment(message?.createdAt).format("HH:mm")}
          </span>

          {!fromMe && (
            <button
              onClick={handleDownloadClick}
              className="absolute right-4 top-4 bg-slate-600/40 hover:bg-slate-500 text-white p-1 rounded-md"
            >
              <Download size={30} />
            </button>
          )}

          {fromMe && (
            <div className="absolute top-2 right-4 flex gap-2 text-xs">
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

          {isEditing && (
            <div className="absolute bottom-0 left-0 w-full bg-white p-2 rounded-b-lg z-20">
              <input
                className="w-full p-1 border rounded"
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
              />
              <div className="flex justify-end gap-2 mt-2">
                <button
                  className="px-2 py-1 bg-gray-300 rounded"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </button>
                <button
                  className="px-2 py-1 bg-blue-500 text-white rounded"
                  onClick={handleEdit}
                >
                  Guardar
                </button>
              </div>
            </div>
          )}
          {!fromMe && selectedConversation?.isGroup && (
            <div className="text-xs font-semibold">
              {message.senderId?.name}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FileMessage;
