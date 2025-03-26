import React from "react";
import Navbar from "./Navbar";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen bg-base-300">
      <Navbar />
      <main className="mt-6 max-w-7xl mx-auto px-4">{children}</main>
    </div>
  );
};

export default Layout;
