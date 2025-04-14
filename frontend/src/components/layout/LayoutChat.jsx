import React from "react";
import { Outlet } from "react-router-dom";
import NavbarChat from "./NavbarChat";

const LayoutChat = () => {
  return (
    <div className=" min-h-screen min-w-screen bg-base-300">
      <NavbarChat />
      <main className="mt-6 mx-auto xl:mx-20">
        <Outlet />
      </main>
    </div>
  );
};

export default LayoutChat;
