import React from "react";
import useConversation from "../../../../../zustand/useConversation";

const FilesViewer = ({ activeIndex }) => {
  const { files } = useConversation();

  return (
    <div className="w-full max-w-[60%]">
      {/*Container */}
      <div className="flex justify-center items-center">
        {files[activeIndex]?.type === "IMAGE" ? (
          <img
            src={files[activeIndex].fileData}
            alt=""
            className="max-w-[80%] object-contain hview"
          />
        ) : files[activeIndex]?.type === "VIDEO" ? (
          <video
            src={files[activeIndex].fileData}
            controls
            className="max-w-[80%] object-contain hview"
          ></video>
        ) : files[activeIndex]?.type === "AUDIO" ? (
          <audio
            src={files[activeIndex].fileData}
            className="max-w-[80%] object-contain my-10"
            controls
            autoPlay
          ></audio>
        ) : (
          <div className="min-w-full hview flex flex-col items-center justify-center">
            {/*File Icon Image */}
            <img
              src={`../images/file/${files[activeIndex]?.type}.png`}
              alt={files[activeIndex]?.type}
            />
            {/*No preview tex */}
            <h1 className="text-2xl">No preview available</h1>
            {/*File size / type */}
            <span>
              {files[activeIndex]?.file?.size} kB - {files[activeIndex]?.type}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default FilesViewer;
