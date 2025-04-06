import { SquarePen } from "lucide-react";
import React from "react";

const Input = ({ message, setMessage }) => {
  return (
    <>
      <div className="w-full max-w-[60%] rounded-lg">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 flex items-center  pl-3 pointer-events-none">
            <SquarePen className="size-5  z-100 " />
          </div>
          <input
            type="text"
            placeholder="Type a message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="pl-10 input input-bordered w-full"
          />
        </div>
      </div>
    </>
  );
};

export default Input;
