import {
  LogOut,
  Settings,
  Wind,
  Search,
  User,
  Home,
  Users,
  Bell,
  MessageSquare,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { logout, RESET } from "../../redux/fectures/auth/authSlice";
import { useNavbar } from "../../../hooks/useNavbar";
import Themes from "../themes/Themes";

const NavbarChat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user } = useSelector((state) => state.auth);

  const { notifications, connectionRequests } = useNavbar();

  const LogoutUser = async () => {
    dispatch(RESET());
    await dispatch(logout());
    navigate("/login");
  };

  const unreadNotificationCount = notifications?.data.filter(
    (notif) => !notif.read
  ).length;
  const unreadConnectionRequestsCount = connectionRequests?.data?.length;

  const messages = [];
  const messagesLength = messages?.filter((message) => !message.read).length;

  return (
    <nav className="bg-base-100  text-base-content border-base-300 shadow-md sticky top-0 z-10">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex sm:justify-between justify-center items-center py-3">
          <div className="flex items-center">
            <div to="/" className="gap-2 hidden sm:flex">
              <MessageSquare size={32} className="text-gray-400" />
              <span className="font-bold text-2xl mr-6 ">HollyChat</span>
            </div>
            <label className="input input-bordered  w-full items-center gap-2 hidden md:flex ">
              <input
                type="text"
                className="flex-1 grow"
                placeholder="Search..."
              />
              <Search size={18} className="hidden" />
            </label>
          </div>

          <div className="flex items-center gap-6  sm:gap-6">
            {user ? (
              <>
                <Link to={"/"} className="flex flex-col items-center">
                  <Home size={20} />
                  <span className="text-xs hidden md:block">Home</span>
                </Link>
                <Link
                  to="/network"
                  className="flex flex-col items-center justify-center relative"
                >
                  <Users size={20} />
                  <span className="text-xs hidden md:block text-center">My Network</span>
                  {unreadConnectionRequestsCount > 0 && (
                    <span
                      className="absolute -top-2 -right-1 md:right-2 bg-blue-500 text-white text-xs 
										rounded-full size-3 md:size-4 flex items-center justify-center"
                    >
                      {unreadConnectionRequestsCount}
                    </span>
                  )}
                </Link>
                <Link
                  to="/notifications"
                  className="flex flex-col items-center relative"
                >
                  <Bell size={20} />
                  <span className="text-xs hidden md:block">Notifications</span>
                  {unreadNotificationCount > 0 && (
                    <span
                      className="absolute -top-1 -right-1 md:right-4 bg-blue-500 text-white text-xs 
										rounded-full size-3 md:size-4 flex items-center justify-center"
                    >
                      {unreadNotificationCount}
                    </span>
                  )}
                </Link>

                <Link
                  to="/chat"
                  className="flex flex-col items-center relative"
                >
                  <MessageSquare size={20} />
                  <span className="text-sm hidden md:block">Messages</span>
                  {messagesLength > 0 && (
                    <span
                      className="absolute -top-2 -right-1 md:right-4 bg-blue-500 text-white text-xs 
										rounded-full size-4 md:size-4 flex items-center justify-center"
                    >
                      {messagesLength}
                    </span>
                  )}
                </Link>
             

              <Themes/>
              <Link
                  to="/profile"
                  className="flex flex-col items-center"
                >
                  <Settings size={20} />
                  <span className="text-sm hidden md:block">Settings</span>
                </Link>

                <Link
                  to={`/profile/${user.username}`}
                  className="flex flex-col items-center"
                >
                  <User size={20} />
                  <span className="text-sm hidden md:block">Me</span>
                </Link>


                <button
                  onClick={LogoutUser}
                  className="flex items-center space-x-1 text-sm cursor-pointer"
                >
                  <LogOut size={20} />
                  <span className="hidden sm:inline">Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn btn-ghost">
                  Sign In
                </Link>
                <Link to="/register" className="btn btn-primary">
                  Join now
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavbarChat;
