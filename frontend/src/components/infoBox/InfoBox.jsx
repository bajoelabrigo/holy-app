import React from "react";

const InfoBox = ({bgColor,  title, count, icon }) => {
  return (
    <div
      className={`card w-full space-x-2 shadow-sm justify-between h-30 bg-${bgColor}`}
    >
      <div className="flex space-x-6 items-center p-4">
        {icon}
        <div className="flex flex-col">
          <p className="text-2xl text-white font-semibold">{title}</p>
          <h4 className="text-white text-xl">{count}</h4>
        </div>
      </div>
    </div>
  );
};

export default InfoBox;
