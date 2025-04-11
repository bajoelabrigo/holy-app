import React from "react";
import Navbar from "./Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <div className="min-h-screen min-w-screen bg-base-300">
      <Navbar />
      <main className="mt-6 max-w-7xl mx-auto px-4">
        <Outlet/>
      </main>
    </div>
  );
};

export default Layout;
