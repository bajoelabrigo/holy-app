import React from "react";
import SettingsPage from "../../pages/SettingsPage";
import { Settings2 } from "lucide-react";

const Themes = () => {
  return (
    <div className="drawer z-10">
      <input id="my-drawer" type="checkbox" className="drawer-toggle" />
      <div className="drawer-content ">
        {/* Page content here */}
        <label
          htmlFor="my-drawer"
          className="flex flex-col items-center cursor-pointer "
        >
          <Settings2 size={20} className="text-center" />
          <span className="text-sm hidden md:block">Themes</span>
        </label>
      </div>
      <div className="drawer-side">
        <label
          htmlFor="my-drawer"
          aria-label="close sidebar"
          className="drawer-overlay"
        ></label>
        <SettingsPage size={20} />
      </div>
    </div>
  );
};

export default Themes;
