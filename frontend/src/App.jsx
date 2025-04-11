import { Toaster } from "react-hot-toast";
import Layout from "./components/layout/Layout";
import Forgot from "./pages/auth/Forgot";
import Login from "./pages/auth/Login";
import LoginWithCode from "./pages/auth/LoginWithCode";
import Register from "./pages/auth/Register";
import Reset from "./pages/auth/Reset";
import Verify from "./pages/auth/Verify";
import ChangePassword from "./pages/changePassword/ChangePassword";
import Home from "./pages/home/Home";
import Profile from "./pages/profile/Profile";
import SettingsPage from "./pages/SettingsPage";
import UserList from "./pages/userlist/UserList";
import { useThemeStore } from "./store/useThemeStore";
import { Routes, Route, Navigate } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useDispatch, useSelector } from "react-redux";
import {
  getLoginStatus,
  getUser,
  selectIsLoggedIn,
  selectUser,
} from "./redux/fectures/auth/authSlice";
import { useEffect } from "react";
import NetworkPage from "./pages/NetworkPage";
import PostPage from "./pages/PostPage";
import ProfilePage from "./pages/ProfilePage";
import ChatPage from "./pages/ChatPage";
import NotificationsPage from "./pages/NotificationPage";
import { ErrorPage } from "./ErrorPage";
import LayoutChat from "./components/layout/LayoutChat";
import ActivitiesPage from "./pages/ActivitiesPage";
import ActivityDetails from "./pages/ActivityDetails";
import ActivityForm from "./components/spiritualActivities/ActivityForm";
import EditActivityPage from "./components/spiritualActivities/EditActivityPage";
import BibleSearch from "./components/BibleReader";
import BibleReader from "./components/BibleReader";

const App = () => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);

  useEffect(() => {
    dispatch(getLoginStatus());
    if (isLoggedIn && user === null) {
      dispatch(getUser());
    }
  }, [dispatch, isLoggedIn, user]);
  const { theme } = useThemeStore();
  return (
    <div data-theme={theme}>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="login" element={<Login />} />
          <Route path="register" element={<Register />} />
          <Route path="forgot" element={<Forgot />} />
          <Route path="resetPassword/:resetToken" element={<Reset />} />
          <Route path="loginWithCode/:email" element={<LoginWithCode />} />
          <Route path="verify/:verificationToken" element={<Verify />} />
          <Route path="profile" element={<Profile />} />
          <Route path="changePassword" element={<ChangePassword />} />
          <Route path="users" element={<UserList />} />
          <Route path="notifications" element={<NotificationsPage />} />
          <Route path="network" element={<NetworkPage />} />
          <Route path="post/:postId" element={<PostPage />} />
          <Route path="profile/:username" element={<ProfilePage />} />
          <Route path="not_found" element={<ErrorPage />} />
          <Route path="*" element={<Navigate to="/not_found" />} />
          {/*Activities */}
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/activity/:activityId" element={<ActivityDetails />} />
          <Route path="/activity-form/:id" element={<ActivityForm />} />
          <Route path="/activity-form" element={<ActivityForm />} />
          <Route path="/activities/edit/:id" element={<EditActivityPage />} />
        </Route>
        {/*Chat */}
        <Route path="/chat" element={<LayoutChat />}>
          <Route index element={<ChatPage />}></Route>
        </Route>
        <Route path="/bible" element={<LayoutChat />}>
          <Route index element={<BibleReader />} />
          {/*Bible */}
        </Route>
      </Routes>
      <ToastContainer />

      <Toaster />
    </div>
  );
};

export default App;
