import { Loader, Lock, Mail, User, UserPlus } from "lucide-react";
import Input from "./Input";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpSchema } from "../../utils/validation";
import PasswordInput from "./PasswordInput";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  loginWithGoogle,
  RESET,
  sendVerificationEmail,
  signUp,
} from "../../redux/fectures/auth/authSlice";
import { GoogleLogin } from "@react-oauth/google";

const SignUpForm = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isLoading, isLoggedIn, isSuccess, message } = useSelector(
    (state) => state.auth
  );
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(signUpSchema),
  });

  const handleSignUp = async (data) => {
    const userData = data;
    await dispatch(signUp(userData));
    await dispatch(sendVerificationEmail());
  };

  useEffect(() => {
    if (isSuccess && isLoggedIn) {
      navigate("/profile");
    }
    dispatch(RESET());
  }, [isLoggedIn, isSuccess, dispatch, navigate]);

  const googleLogin = async (credentialResponse) => {
    console.log(credentialResponse);
    await dispatch(
      loginWithGoogle({ userToken: credentialResponse.credential })
    );
  };

  return (
    <form onSubmit={handleSubmit(handleSignUp)} className="flex flex-col gap-4">
      <Input
        icon={User}
        name="name"
        register={register}
        error={errors?.name?.message}
        type="text"
        placeholder="Full name"
        className="input input-bordered w-full"
      />

      <Input
        icon={UserPlus}
        name="username"
        register={register}
        error={errors?.username?.message}
        type="text"
        placeholder="Username"
        className="input input-bordered w-full"
      />
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
          "Agree & Join"
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
