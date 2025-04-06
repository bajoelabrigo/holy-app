import React, { useState } from "react";
import Header from "./Header";
import FilesViewer from "./FilesViewer";
import Input from "./Input";
import HandleAndSend from "./HandleAndSend";

const FilesPreview = () => {
  const [message, setMessage] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="relative py-2 w-full flex items-center justify-center ">
      {/*Container */}
      <div className="w-full flex flex-col items-center">
        {/*Header */}
        <Header activeIndex={activeIndex} />
        {/*Viewing selected file */}
        <FilesViewer activeIndex={activeIndex} />
        <div className="w-full flex flex-col items-center">
          {/*Message Input*/}
          <Input message={message} setMessage={setMessage} />
          {/*Send and manipulate files */}
          <HandleAndSend
            activeIndex={activeIndex}
            setActiveIndex={setActiveIndex}
            message={message}
          />
        </div>
      </div>
    </div>
  );
};

export default FilesPreview;
