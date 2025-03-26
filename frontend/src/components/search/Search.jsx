import React from "react";
import { Search } from "lucide-react";

const SearchProducts = ({value, onChange}) => {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 flex items-center  pl-3 pointer-events-none">
        <Search className="size-5  z-100 " />
      </div>
      <input
        type="text"
        placeholder="Search Users"
        value={value}
        onChange={onChange}
        className="pl-10 input input-bordered w-full"
      />
    </div>
  );
};

export default SearchProducts;
