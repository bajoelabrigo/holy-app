import { Camera, Clapperboard, User } from "lucide-react";
import PhotoAttachment from "./PhotoAttachment";
import DocumentAttachment from "./DocumentAttachment";
import VideoAttachment from "./VideoAttachment";
import { Link } from "react-router-dom";
import AudioAttachment from "./AudioAttachment";

const MenuAttachment = () => {
  return (
    <ul className="absolute bottom-16 left-10 openEmojiAnimation space-y-4 cursor-pointer">
      <li>
        <Link to="/profile">
          <button
            type="button"
            className="bg-[#5F66CD] rounded-full p-2 cursor-pointer text-white"
          >
            <User size={32} />
          </button>
        </Link>
      </li>
      <li>
        <PhotoAttachment />
      </li>
      <li>
        <VideoAttachment />
      </li>
      <li>
        <AudioAttachment />
      </li>
      <li>
        <DocumentAttachment />
      </li>
    </ul>
  );
};

export default MenuAttachment;
