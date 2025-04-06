import { Download } from "lucide-react";
import React from "react";
import FileImageVideo from "./FileImageVideo";
import FileOthers from "./FileOthers";
import moment from "moment";
import useConversation from "../../../../zustand/useConversation";
import { useSelector } from "react-redux";
import { extractTime } from "../../../utils/extractTime";

const FileMessage = ({ FileMessage, message }) => {
  const { file, type } = FileMessage;
  const { user: authUser } = useSelector((state) => state.auth);
  const { selectedConversation } = useConversation();

  const fromMe =
    String(message.senderId?._id || message.senderId) === String(authUser?._id);

  const formattedTime = extractTime(message?.createdAt);

  const chatClassName = fromMe ? "chat-end" : "chat-start";
  const profilePic = fromMe
    ? authUser?.profilePicture || "/avatar.png"
    : selectedConversation?.profilePicture || "/avatar.png";
  const bubbleBgColor = fromMe ? "bg-blue-500" : "bg-purple-500";

  const handleDownloadClick = () => {
    const link = document.createElement("a");
    link.href = file.secure_url;
    link.setAttribute("download", file.original_filename || "file");
    link.setAttribute("target", "_self"); // NO abrir en otra pestaña
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div
      className={`flex mt-3 space-x-3 max-w-xs z-10 mb-2  ${
        fromMe ? "ml-auto justify-end " : ""
      }`}
      onClick={
        !fromMe && file?.type === "AUDIO" && file.type === "VIDEO"
          ? handleDownloadClick
          : null
      }
    >
      {/*Message Container*/}
      <div className="relative flex space-x-12">
        {/* sender user message */}
        {!fromMe && (
          <>
            <div className="chat-image avatar size-10 rounded-full ">
              <img
                src={profilePic || "/avatar.png"}
                alt=""
                className="rounded-full object-cover ml-10"
              />
            </div>
          </>
        )}

        <div
          className={`relative h-full dark:text-dark_text_1 rounded-xl
        ${fromMe ? " bg-blue-500" : "bg-purple-500"}
        ${
          fromMe && file?.public_id?.split(".")[1] === "png"
            ? "bg-white"
            : "bg-green_3 px-2 pt-2 pb-6 rounded-tr-none"
        }
        
        `}
        >
          {/*Message*/}
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
          {/*Message Date*/}
          <span className="absolute right-1.5 bottom-1 text-xs leading-none">
            {moment(message?.createdAt).format("HH:mm")}
          </span>
          {/*Traingle*/}
          {!fromMe ? (
            <>
              <button
                onClick={handleDownloadClick}
                className="absolute right-4 top-4 bg-slate-600/40 hover:bg-slate-500  text-white  p-1 rounded-md"
              >
                <Download size={30} />
              </button>
            </>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default FileMessage;
