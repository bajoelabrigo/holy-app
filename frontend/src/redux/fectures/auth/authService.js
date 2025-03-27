import axios from "axios";
import { axiosInstance } from "../../../lib/axios";

const BACKEND_URL = import.meta.env.VITE_REACT_APP_BACKEND_URL;
export const API_URL = `${BACKEND_URL}/api/users/`;

// Validate email
export const validateEmail = (email) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};

//!Register User
const register = async (userData) => {
  const response = await axiosInstance.post("/users/register", userData);
  return response.data;
};

//!Login User
const login = async (userData) => {
  const response = await axiosInstance.post("/users/login", userData);
  return response.data;
};

//!Logout User
const logout = async () => {
  const response = await axiosInstance.get("/users/logout");
  return response.data.message;
};

//!Get Login Status
const getLoginStatus = async () => {
  const response = await axiosInstance.get("/users/loginStatus");
  return response.data;
};

//!Get User Profile
const getUser = async () => {
  const response = await axiosInstance.get("/users/getUser");
  return response.data;
};

//!Update Profile
const updateUser = async (userData) => {
  const response = await axiosInstance.patch("/users/updateUser", userData);
  return response.data;
};

//!Send Verification Email
const sendVerificationEmail = async () => {
  const response = await axiosInstance.post("/users/sendVerificationEmail");
  return response.data.message;
};

//!Verify User
const verifyUser = async (verificationToken) => {
  const response = await axiosInstance.patch(
    `/users/verifyUser/${verificationToken}`
  );
  return response.data.message;
};

//!Change Password
const changePassword = async (userData) => {
  const response = await axiosInstance.patch("/users/changePassword", userData);
  return response.data.message;
};

//!Reset Password
const resetPassword = async (userData, resetToken) => {
  const response = await axiosInstance.patch(
    `/users/resetPassword/${resetToken}`,
    userData
  );
  return response.data.message;
};

//!FORGOT PASSWORD
const forgotPassword = async (userData) => {
  const response = await axiosInstance.post("/users/forgotPassword", userData);
  return response.data.message;
};

//!Get Users
const getUsers = async () => {
  const response = await axiosInstance.get("/users/getUsers");
  return response.data;
};

//!Delete User
const deleteUser = async (id) => {
  const response = await axiosInstance.delete("/users/" + id);
  return response.data.message;
};

//!Upgrade User
const upgradeUser = async (userData) => {
  const response = await axiosInstance.post("/users/upgradeUser", userData);
  return response.data.message;
};

//!Send Login Code
const sendLoginCode = async (email) => {
  const response = await axiosInstance.post(`/users/sendLoginCode/${email}`);
  return response.data.message;
};

//!Login With Code
const loginWithCode = async (code, email) => {
  const response = await axiosInstance.post(`/users/loginWithCode/${email}`, code);
  return response.data;
};

//!Login With Google
const loginWithGoogle = async (userToken) => {
  const response = await axiosInstance.post("/users/google/callback", userToken);
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getLoginStatus,
  getUser,
  updateUser,
  sendVerificationEmail,
  verifyUser,
  changePassword,
  forgotPassword,
  resetPassword,
  getUsers,
  deleteUser,
  upgradeUser,
  sendLoginCode,
  loginWithCode,
  loginWithGoogle,
};

export default authService;
