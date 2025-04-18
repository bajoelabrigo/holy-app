import { Link } from "react-router-dom";
import {
  Home,
  UserPlus,
  Bell,
  MessageSquare,
  Settings2,
  UsersRound,
  Book,
} from "lucide-react";
import { Church, HandsPraying } from "@phosphor-icons/react";
import { useConnectionRequest } from "../../hooks/useConnectionRequest";

export default function Sidebar({ user }) {
  const imgUrl = user?.profilePicture?.toString();

  const { connections } = useConnectionRequest();

  return (
    <div className="bg-base-100 text-base-content rounded-lg shadow">
      <div className="p-4 text-center">
        <div
          className="h-16 rounded-t-lg bg-cover bg-center"
          style={{
            backgroundImage: `url("${user?.bannerImg || "/banner.png"}")`,
          }}
        />
        <Link to={`/profile/${user?.username}`}>
          <img
            src={imgUrl || "/avatar.png"}
            alt={user?.name}
            className="w-20 h-20 rounded-full mx-auto mt-[-40px] object-cover overflow-hidden"
          />
          <h2 className="text-xl font-semibold mt-2">{user?.name}</h2>
          <button className="btn btn-primary font-semibold">
            {user?.role}
          </button>
        </Link>
        <p className="text-info mt-2">{user?.headline}</p>
        <p className="text-secondary text-xs font-semibold">
          {connections?.data?.length} connections
        </p>
      </div>
      <div className="border-t border-base-100 p-4">
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                to="/"
                className="flex items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors"
              >
                <Home className="mr-2" size={20} /> Home
              </Link>
            </li>
            <li>
              <Link
                to="/activities"
                className="flex items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors"
              >
                <HandsPraying className="mr-2" size={20} /> Spiritual Activities
              </Link>
            </li>
            {user?.role === "admin" ? (
              <li>
                <Link
                  to="/activity-form"
                  className="flex items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors"
                >
                  <Church className="mr-2" size={20} /> Add Spiritual Activities
                </Link>
              </li>
            ) : null}
            <li>
              <Link
                to="/bible"
                className="flex items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors"
              >
                <Book className="mr-2" size={20} /> Read the Bible
              </Link>
            </li>
            <li>
              <Link
                to="/network"
                className="flex items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors"
              >
                <UserPlus className="mr-2" size={20} /> My Network
              </Link>
            </li>
            <li>
              <Link
                to="/notifications"
                className="flex items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors"
              >
                <Bell className="mr-2" size={20} /> Notifications
              </Link>
            </li>
            <li>
              <Link
                to="/chat"
                className="flex items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors"
              >
                <MessageSquare className="mr-2" size={20} /> Messages
              </Link>
            </li>
            <li>
              <Link
                to="/chat"
                className="flex items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors"
              >
                <Settings2 className="mr-2" size={20} /> Settings
              </Link>
            </li>
            {user?.role === "admin" ? (
              <li>
                <Link
                  to="/users"
                  className="flex items-center py-2 px-4 rounded-md hover:bg-primary hover:text-white transition-colors"
                >
                  <UsersRound className="mr-2" size={20} /> List Users
                </Link>
              </li>
            ) : null}
          </ul>
        </nav>
      </div>
      <div className="border-t border-base-100 p-4">
        <Link
          to={`/profile/${user?.username}`}
          className="text-sm font-semibold"
        >
          Visit your profile
        </Link>
      </div>
    </div>
  );
}
