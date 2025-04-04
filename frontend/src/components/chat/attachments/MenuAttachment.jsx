import { Camera, Clapperboard, User } from "lucide-react";
import PhotoAttachment from "./PhotoAttachment";
import DocumentAttachment from "./DocumentAttachment";

const MenuAttachment = () => {
  return (
    <ul className="absolute bottom-16 left-12 openEmojiAnimation space-y-4 cursor-pointer">
      <li>
        <button
          type="button"
          className="bg-[#5F66CD] rounded-full p-2 cursor-pointer text-white"
        >
          <User size={32} />
        </button>
      </li>
      <li>
        <PhotoAttachment />
      </li>
      <li>
        <button
          type="button"
          className="bg-[#D3396D] rounded-full p-2 cursor-pointer"
        >
          <Clapperboard size={32} className="text-white"/>
        </button>
      </li>
      <li>
        <DocumentAttachment />
      </li>
    </ul>
  );
};

export default MenuAttachment;
