import { createContext, useState } from "react";

export const HelpersContext = createContext();

export const HelpersContextProvider = ({ children }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  return (
    <HelpersContext.Provider
      value={{
        showCreateGroup,
        setShowCreateGroup,
        showMenu,
        setShowMenu,
      }}
    >
      {children}
    </HelpersContext.Provider>
  );
};
