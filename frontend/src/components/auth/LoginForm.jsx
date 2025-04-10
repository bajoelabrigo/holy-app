import { Loader, Lock, Mail, User, UserPlus } from "lucide-react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signInSchema } from "../../utils/validation";
import PasswordInput from "./PasswordInput";
import { Link, useNavigate } from "react-router-dom";
import Input from "./Input";
import { useDispatch, useSelector } from "react-redux";
import {
  login,
  loginWithGoogle,
  RESET,
  sendLoginCode,
} from "../../redux/fectures/auth/authSlice";
import { useEffect, useState } from "react";
import { GoogleLogin } from "@react-oauth/google";

const SignUpForm = () => {
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isLoggedIn, isSuccess, message, isError, twoFactor } =
    useSelector((state) => state.auth);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signInSchema),
  });

  const onSubmit = async (data) => {
    const userData = data;
    setEmail(userData.email);
    await dispatch(login(userData));
  };
  useEffect(() => {
    if (isSuccess && isLoggedIn) {
      navigate("/");
    }
    if (isError && twoFactor) {
      dispatch(sendLoginCode(email));
      navigate(`/loginWithCode/${email}`);
    }

    dispatch(RESET());
  }, [isLoggedIn, isSuccess, dispatch, navigate, isError, twoFactor, email]);

  const googleLogin = async (credentialResponse) => {
    console.log(credentialResponse);
    await dispatch(
      loginWithGoogle({ userToken: credentialResponse.credential })
    );
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-4 w-full max-w-md"
    >
      <Input
        icon={Mail}
        name="email"
        register={register}
        error={errors?.email?.message}
        type="email"
        placeholder="Email Adrress"
        className="input input-bordered w-full"
      />
      <PasswordInput
        icon={Lock}
        name="password"
        register={register}
        error={errors?.password?.message}
        placeholder="Password (6+ characters)"
        className="input input-bordered w-full"
      />
      <div className="flex items-center">
        <Link to="/forgot" className="text-sm text-primary hover:underline">
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
          "Agree & Login"
        )}
      </motion.button>
      <div className="flex justify-center items-center">
        <GoogleLogin
          onSuccess={googleLogin}
          onError={() => {
            console.log("Login Failed");
            toast.error("Login Failed");
          }}
        />
      </div>
    </form>
  );
};

export default SignUpForm;
