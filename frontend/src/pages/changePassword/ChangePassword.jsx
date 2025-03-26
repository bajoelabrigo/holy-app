import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Loader, Lock, Mail, User, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import PasswordChangeInput from "../../components/auth/PasswordChangeInput";

const initialState = {
  password: "",
  password2: "",
  oldPassword: "",
};

const isLoading = false;

const ChangePassword = () => {
  const [formData, setFormData] = useState(initialState);
  const { oldPassword, password, password2 } = formData;

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const updatePassword = async (e) => {
    e.preventDefault();
    if (!oldPassword || !password || !password2) {
      return toast.error("All fields are required");
    }
    if (password !== password2) {
      return toast.error("Password do not match");
    }
    const userData = {
      oldPassword,
      password,
    };
    console.log(userData);
  };

  return (
    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className=" text-center text-3xl font-extrabold text-primary">
          Change Password
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md shadow-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <form onSubmit={updatePassword} className="space-y-4 w-full max-w-md">
            <PasswordChangeInput
              icon={Lock}
              placeholder="Old Password"
              name="oldPassword"
              className="input input-bordered w-full"
              value={oldPassword}
              onChange={handleInputChange}
            />
            <PasswordChangeInput
              icon={Lock}
              placeholder="Password"
              name="password"
              className="input input-bordered w-full"
              value={password}
              onChange={handleInputChange}
            />
            <PasswordChangeInput
              icon={Lock}
              placeholder="Confirm Password"
              name="password2"
              className="input input-bordered w-full"
              value={password2}
              onChange={handleInputChange}
            />
            <div className="flex items-center">
              <Link
                to="/forgot"
                className="text-sm text-primary hover:underline"
              >
                Forgot password?
              </Link>
            </div>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={isLoading}
              className="btn btn-primary w-full text-white"
            >
              {isLoading ? (
                <Loader className="size-5 animate-spin" />
              ) : (
                "Change Password"
              )}
            </motion.button>
          </form>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">
                  New to HolyHolyHoly?
                </span>
              </div>
            </div>
            <div className="mt-6">
              <Link
                to="/signup"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-blue-600 bg-white hover:bg-gray-50"
              >
                Join now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
