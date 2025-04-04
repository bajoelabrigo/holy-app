import { ListFilter, MoveLeft, Search } from "lucide-react";
import React, { useContext, useState } from "react";
import { HelpersContext } from "../../../../context/helpersContext";
import { axiosInstance } from "../../../lib/axios";
import toast from "react-hot-toast";
import { handleError } from "../../../../hooks/chatService";

const SearchInput = ({ searchLength, setSearchResults }) => {
  const [search, setSearch] = useState("");
  const { showCreateGroup, setShowCreateGroup, showMenu, setShowMenu } =
    useContext(HelpersContext);
  const [show, setShow] = useState(false);

  const handleSearch = async (e) => {
    if (e.target.value && e.key === "Enter") {
      try {
        const { data } = await axiosInstance.get(
          `/users?search=${e.target.value}`
        );
        setSearchResults(data);
      } catch (error) {
        toast.error(handleError(error));
      }
    } else {
      setSearchResults([]);
    }
  };

  return (
    <div className="h-[49px] py-1.5 relative">
      {/*container*/}
      <div className="px-[10px]">
        {/*search input container*/}
        <div className="flex items-center gap-x-2">
          <div className="w-full dark:bg-dark_bg_2 flex rounded-lg pl-2">
            {show || searchLength > 0 ? (
              <span
                className="left-8 top-3 z-4 w-8 absolute flex items-center justify-center rotateAnimation cursor-pointer"
                onClick={() => setSearchResults([])}
              >
                <MoveLeft className="text-success" />
              </span>
            ) : (
              <span className=" absolute flex left-8 top-3 z-4 w-8  items-center justify-center ">
                <Search className="w-5" />
              </span>
            )}
            <input
              type="text"
              placeholder="Search or start a new chat"
              className="input placeholder:text-center w-full text-center"
              onFocus={() => setShow(true)}
              onBlur={() => searchLength === 0 && setShow(false)}
              onKeyDown={(e) => handleSearch(e)}
            />
          </div>
          <button className="btnChat">
            <ListFilter className="dark:fill-dark_svg_2" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SearchInput;
