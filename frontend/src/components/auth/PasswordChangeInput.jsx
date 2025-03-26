import { EyeOff, Eye } from "lucide-react";
import React, { useState } from "react";

const PasswordChangeInput = ({
  icon: Icon,
  placeholder,
  value,
  onChange,
  name,
  onPaste,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 flex items-center  pl-3 pointer-events-none">
          <Icon className="size-5 z-100" />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          placeholder={placeholder}
          required
          name={name}
          value={value}
          onChange={onChange}
          onPaste={onPaste}
          className="pl-10 input input-bordered w-full"
        />
        <div
          className="size-5 z-100 top-2.5 right-2.5 absolute"
          onClick={togglePassword}
        >
          {showPassword ? <Eye size={20} /> : <EyeOff size={20} />}
        </div>
      </div>
    </>
  );
};

export default PasswordChangeInput;
