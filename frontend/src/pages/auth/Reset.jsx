import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";
import { Eye, EyeOff, Lock } from "lucide-react";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { RESET, resetPassword } from "../../redux/fectures/auth/authSlice";

const initialState = {
  password: "",
  password2: "",
};

const Reset = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  const togglePassword2 = () => {
    setShowPassword2(!showPassword2);
  };
  const [formData, setFormData] = useState(initialState);
  const { password, password2 } = formData;
  const { resetToken } = useParams();

  const { isLoading, isSuccess, message } = useSelector((state) => state.auth);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const reset = async (e) => {
    e.preventDefault();

    // Check Lower and Uppercase
    if (!password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
      return toast.error("Password must have lower case and upper case");
    }
    // Check for numbers
    if (!password.match(/([0-9])/)) {
      return toast.error("Password must have number");
    }
    if (password.length < 6) {
      return toast.error("Password must be up to 6 characters");
    }
    if (password !== password2) {
      return toast.error("Password do not match");
    }

    const userData = { password };

    await dispatch(resetPassword({ userData, resetToken }));
  };

  useEffect(() => {
    if (isSuccess && message.includes("Reset Successful")) {
      navigate("/login");
    }
    dispatch(RESET());
  }, [dispatch, navigate, message, isSuccess]);

  return (
    <div className="flex justify-center items-center h-screen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full rounded-2xl bg-white shadow-2xl overflow-hidden"
      >
        <div className="p-8">
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-primary bg-clip-text">
            Reset Password
          </h2>
          {message && <p className="text-green-500 text-sm mb-4">{message}</p>}

          <form onSubmit={reset}>
            <div className="mb-4 relative">
              <div className="flex px-2 items-center gap-x-2">
                <div className="w-full input flex rounded-lg pl-2 space-x-2">
                  <span className="w-8 flex items-center justify-center cursor-pointer">
                    <Lock />
                  </span>
                  <input
                    placeholder="Password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={handleInputChange}
                    required
                  />
                  <div
                    className="size-5 z-100 top-2.5 right-2.5 absolute cursor-pointer"
                    onClick={togglePassword}
                  >
                    {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
                  </div>
                </div>
              </div>
            </div>
            <div className="mb-4">
              <div className="flex px-2 items-center gap-x-2">
                <div className="w-full input flex rounded-lg pl-2 space-x-2">
                  <span className="w-8 flex items-center justify-center cursor-pointer">
                    <Lock />
                  </span>
                  <input
                    placeholder="Confirm Password"
                    name="password2"
                    t
                    type={showPassword2 ? "text" : "password"}
                    value={password2}
                    onChange={handleInputChange}
                    required
                  />
                  <div
                    className="size-5 z-100 top-2.5 right-2.5 absolute cursor-pointer"
                    onClick={togglePassword2}
                  >
                    {showPassword2 ? <Eye size={20} /> : <EyeOff size={20} />}
                  </div>
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-4 bg-gradient-to-r bg-primary text-white font-bold rounded-lg shadow-lg hover:from-sky-600 hover:to-sky-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-900 transition duration-200"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? "Resetting..." : "Set New Password"}
            </motion.button>
          </form>
        </div>
      </motion.div>
    </div>
  );
};
export default Reset;
