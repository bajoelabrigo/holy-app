import React from "react";
import BibleDetail from "./BibleDetail";
import Sidebar from "./Sidebar";
import { useSelector } from "react-redux";
import { usePost } from "../../hooks/usePost";

const BibleReader = () => {
  const { user } = useSelector((state) => state.auth);
  return (
    <div className="flex justify-center mx-4 gap-6 overflow-hidden">
      <div className="hidden lg:flex max-h-[800px] ">
        <Sidebar user={user} />
      </div>
      <div >
        <BibleDetail />
      </div>
    </div>
  );
};

export default BibleReader;
