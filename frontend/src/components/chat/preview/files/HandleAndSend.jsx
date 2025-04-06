import React, { useState } from "react";
import useConversation from "../../../../../zustand/useConversation";
import { ClipLoader } from "react-spinners";
import VideoThumbnail from "react-video-thumbnail";
import { SendHorizonal, X } from "lucide-react";
import Add from "./Add";
import { uploadFiles } from "../../../../utils/upload";
import useSendMessage from "../../../../../hooks/useSendMessage";

const HandleAndSend = ({ setActiveIndex, activeIndex, message }) => {
  const { sendMessage } = useSendMessage();
  const [loading, setLoading] = useState(false);
  const { setFiles, files, removeFile } = useConversation();

  const clearFilesHandler = () => {
    setFiles(() => []);
  };

  const sendMessageHandler = async (e) => {
    e.preventDefault();
    if (!message.trim() && files.length === 0) {
      // Puedes mostrar un mensaje de error o simplemente salir
      console.log("No puedes enviar un mensaje vacío");
      return;
    }
    setLoading(true);
    //upload files first
    const uploaded_files = await uploadFiles(files);
    //send the message

    await sendMessage({
      message: message.trim(), // limpia espacios
      files: uploaded_files.length > 0 ? uploaded_files : undefined,
    });

    clearFilesHandler();
    setLoading(false);
  };

  return (
    <div className="w-[97%] flex items-center justify-between mt-2 border-t">
      {/*Empty */}
      <span></span>
      {/*List Files */}
      <div className="flex items-center gap-x-2">
        {files.map((file, i) => (
          <div
            key={i}
            className={`fileThumbnail relative w-14 h-14 border mt-2 rounded-md overflow-hidden cursor-pointer ${
              activeIndex === i ? "border-[3px] !border-green-500" : ""
            }`}
            onClick={() => setActiveIndex(i)}
          >
            {file.type === "IMAGE" ? (
              <img
                src={file.fileData}
                alt=""
                className="w-full h-full object-cover"
              />
            ) : file.type === "VIDEO" ? (
              <VideoThumbnail videoUrl={file.fileData} />
            ) : (
              <img
                src={`../images/file/${file.type}.png`}
                alt=""
                className="w-8 h-10 mt-1.5 ml-2.5"
              />
            )}
            {/*Remove file icon */}
            <div
              className="removeFileIcon text-red-400 "
              onClick={() => removeFile(i)}
            >
              <X size={18} className="absolute right-0 top-0  rounded-xl" />
            </div>
          </div>
        ))}
        {/*Add another file */}
        <Add setActiveIndex={setActiveIndex} />
      </div>
      {/*Send Button */}
      <div
        className="bg-green_1 w-16 h-16 mt-2 rounded-full flex items-center justify-center cursor-pointer"
        onClick={(e) => sendMessageHandler(e)}
      >
        {loading ? <ClipLoader size={32} /> : <SendHorizonal size={32} />}
      </div>
    </div>
  );
};

export default HandleAndSend;
