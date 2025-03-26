import { useEffect, useRef, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import {
  loginWithCode,
  RESET,
  sendLoginCode,
} from "../../redux/fectures/auth/authSlice";

const LoginWithCode = () => {
  const [loginCode, setLoginCode] = useState("");
  const { email } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isLoggedIn, isSuccess } = useSelector(
    (state) => state.auth
  );

  const sendUserLoginCode = async () => {
    await dispatch(sendLoginCode(email));
    await dispatch(RESET());
  };

  const loginUserWithCode = async (e) => {
    e.preventDefault();

    if (loginCode === "") {
      return toast.error("Please fill in the login code");
    }
    if (loginCode.length !== 6) {
      return toast.error("Access code must be 6 characters");
    }

    const code = {
      loginCode,
    };

    await dispatch(loginWithCode({ code, email }));
  };

  useEffect(() => {
    if (isSuccess && isLoggedIn) {
      navigate("/profile");
      loginCode;
    }

    dispatch(RESET());
  }, [isLoggedIn, isSuccess, dispatch, navigate]);

  return (
    <div className="w-full flex h-screen items-center justify-center">
      <div className="max-w-md w-full bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md"
        >
          <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text">
            Enter Access Code
          </h2>
          <p className="text-center  mb-6">
            Enter the 6-digit code sent to your email address.
          </p>

          <form onSubmit={loginUserWithCode} className="space-y-4">
            <div className="flex items-center justify-center">
              <input
                type="text"
                placeholder="Access Code"
                required
                name="loginCode"
                value={loginCode}
                onChange={(e) => setLoginCode(e.target.value)}
                className="input input-success w-full text-xl font-semibold placeholder:text-sm text-center"
              />
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-gradient-to-r from-green-600 to-emerald-700  text-white font-bold py-3 px-4 rounded-lg disabled:opacity-50"
            >
              {isLoading ? "Verifying..." : "Proceed to Login"}
            </motion.button>

            <p className="text-center">
              Check your email for login access code
            </p>
            <div className="flex justify-between">
              <p className="font-semibold">
                <Link to="/">- Home</Link>
              </p>
              <p
                className="text-info cursor-pointer"
                onClick={sendUserLoginCode}
              >
                <b>Resend Code</b>
              </p>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
export default LoginWithCode;
