import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const LayoutChat = () => {
  return (
    <div className=" min-h-screen min-w-screen bg-base-300">
      <Navbar />
      <main className="mt-6 mx-auto xl:mx-20">
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutChat;
