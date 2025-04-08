import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  getLoginStatus,
  getUser,
  verifyUser,
} from "../../redux/fectures/auth/authSlice";

const Verify = () => {
  const dispatch = useDispatch();
  const { verificationToken } = useParams();
  const navigate = useNavigate();

  const { isLoading } = useSelector((state) => state.auth);

  const verifyAccount = async () => {
    const res = await dispatch(verifyUser(verificationToken));
    if (res.meta.requestStatus === "fulfilled") {
      await dispatch(getLoginStatus()); // o getUser()
      await dispatch(getUser()); // o getUser()
      
    }
  };

  return (
    <section>
      {isLoading && <p>Loading</p>}
      <div className="flex flex-col justify-center items-center">
        <h2>Account Verification</h2>
        <p>To verify your account, click the button below...</p>
        <br />
        <button onClick={verifyAccount} className="btn btn-primary">
          Verify Account
        </button>
      </div>
    </section>
  );
};

export default Verify;
