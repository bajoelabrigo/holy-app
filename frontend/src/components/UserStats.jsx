import React, { useEffect } from "react";
import InfoBox from "./infoBox/InfoBox";
import {
  UserRoundCheck,
  UserRoundMinus,
  UserRoundX,
  Users,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  CALC_SUSPENDED_USER,
  CALC_VERIFIED_USER,
} from "../redux/fectures/auth/authSlice";

// Icons
const icon1 = <Users size={40} color="white" />;
const icon2 = <UserRoundCheck size={40} color="white" />;
const icon3 = <UserRoundMinus size={40} color="white" />;
const icon4 = <UserRoundX size={40} color="white" />;

const UserStats = () => {
  const dispatch = useDispatch();
  const { users, verifiedUsers, suspendedUsers } = useSelector(
    (state) => state.auth
  );
  const unverifiedUsers = users.length - verifiedUsers;

  useEffect(() => {
    dispatch(CALC_VERIFIED_USER());
    dispatch(CALC_SUSPENDED_USER());
  }, [dispatch, users]);

  return (
    <div className="w-full space-y-4">
      <h3 className="text-3xl font-semibold">User Stats</h3>
      <div className="md:flex lg:flex space-x-4 space-y-4">
        <InfoBox
          icon={icon1}
          title={"Total Users"}
          count={users.length}
          bgColor="primary"
        />
        <InfoBox
          icon={icon2}
          title={"Verified Users"}
          count={verifiedUsers}
          bgColor="secondary"
        />
        <InfoBox
          icon={icon3}
          title={"Unverified Users"}
          count={unverifiedUsers}
          bgColor="accent"
        />
        <InfoBox
          icon={icon4}
          title={"Suspended Users"}
          count={suspendedUsers}
          bgColor="red-500"
        />
      </div>
    </div>
  );
};

export default UserStats;
