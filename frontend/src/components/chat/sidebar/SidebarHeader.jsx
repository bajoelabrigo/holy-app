import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { HelpersContext } from "../../../../context/helpersContext";
import { EllipsisVertical, History, MessageSquare, Users } from "lucide-react";
import MenuChat from "../MenuChat";
import CreateGroup from "../createGroup/CreateGroup";

const SidebarHeader = () => {
  const { user } = useSelector((state) => state.auth);
  const { showCreateGroup, setShowCreateGroup, showMenu, setShowMenu } =
    useContext(HelpersContext);

  return (
    <>
      {/*Sidebar header */}
      <div className="flex items-center p-4">
        {/*Container*/}
        <div className="w-full flex items-center justify-between">
          {/*user image*/}
          <button className="w-14 h-14">
            <img
              src={user?.profilePicture}
              alt={user?.name}
              className="w-full h-full rounded-full object-cover overflow-hidden"
            />
          </button>
          {/*user icons*/}
          <ul className="flex items-center gap-x-2.5">
            <li>
              <button
                className="btnMain "
                onClick={() => setShowCreateGroup(true)}
              >
                <Users size={32} />
              </button>
            </li>
            <li>
              <button className="btnMain">
                <History size={32} />
              </button>
            </li>
            <li>
              <button className="btnMain">
                <MessageSquare size={32} />
              </button>
            </li>
            <li
              className="relative"
              onClick={() => setShowMenu((prev) => !prev)}
            >
              <button className={`btnMain ${showMenu ? "bg-base-300" : ""}`}>
                <EllipsisVertical size={32} />
              </button>
              {showMenu ? <MenuChat /> : null}
            </li>
          </ul>
        </div>
      </div>
      {/*Create Group */}
      {showCreateGroup && (
        <CreateGroup setShowCreateGroup={setShowCreateGroup} />
      )}
    </>
  );
};

export default SidebarHeader;
