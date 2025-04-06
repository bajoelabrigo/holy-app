import useConversation from "../../../../../zustand/useConversation";
import { X } from "lucide-react";

const Header = ({ activeIndex }) => {
  const { files, setFiles } = useConversation();

  const clearFilesHandler = () => {
    setFiles(() => []);
  };
  return (
    <div className="w-full">
      {/*Container */}
      <div className="w-full flex items-center justify-between">
        {/*Close icon / emty files */}
        <div
          className="cursor-pointer translate-x-4"
          onClick={() => clearFilesHandler()}
        >
          <X size={32} />
        </div>
        {/*File name */}
        <h1 className="text-xl font-semibold">{files[activeIndex]?.file?.name}</h1>
        {/*Empty tag */}
        <span></span>
      </div>
    </div>
  );
};

export default Header;
