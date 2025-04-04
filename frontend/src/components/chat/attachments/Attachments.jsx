import { Paperclip } from "lucide-react";
import React from "react";
import MenuAttachment from "./MenuAttachment";

const Attachments = ({
  showAttachments,
  setShowAttachments,
  setShowPicker,
}) => {
  return (
    <div className="relative">
      <button
        onClick={() => {
          setShowAttachments((pre) => !pre);
        }}
        type="button"
        className="absolute left-12 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-sky-500 focus:outline-none"
      >
        <Paperclip size={24} />
      </button>
      {/* Menu */}
      {showAttachments ? <MenuAttachment /> : null}
    </div>
  );
};

export default Attachments;
