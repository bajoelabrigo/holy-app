import React, { useContext } from "react";
import { HelpersContext } from "../../../context/helpersContext";
import { logout, RESET } from "../../redux/fectures/auth/authSlice";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";

const MenuChat = () => {
  const { showCreateGroup, setShowCreateGroup, showMenu, setShowMenu } =
    useContext(HelpersContext);
  const dispatch = useDispatch();

  const LogoutUser = async () => {
    dispatch(RESET());
    await dispatch(logout());
    navigate("/login");
  };
  return (
    <>
      <div
        className={`absolute -right-1 top-14 bg-base-200 shadow-amber-100/10 z-50  shadow-md w-52`}
      >
        <ul>
          <li
            className="py-3 pl-5 cursor-pointer hover:bg-base-100"
            onClick={() => setShowCreateGroup(true)}
          >
            <span>New group</span>
          </li>

          <Link to="/profile">
            <li className="py-3 pl-5 cursor-pointer hover:bg-base-100">
              Setting
            </li>
          </Link>
          <li
            className="py-3 pl-5 cursor-pointer hover:bg-base-100"
            onClick={LogoutUser}
          >
            <span>Logout</span>
          </li>
        </ul>
        {/*Create Group */}
      </div>
    </>
  );
};

export default MenuChat;
