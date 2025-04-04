import { useState } from "react";
import SearchInput from "./SearchInput";
import Conversations from "./Conversations";
import SidebarHeader from "./SidebarHeader";
import Notifications from "./Notifications";
import SearchResults from "./SearchResults";

const SidebarChat = () => {
  const [searchResults, setSearchResults] = useState([]);

  return (
    <aside className="w-full space-y-2 convos scrollbar">
      <SidebarHeader />
      <Notifications />
      <SearchInput
        searchLength={searchResults.length}
        setSearchResults={setSearchResults}
      />

      {searchResults.length > 0 ? (
        <>
          {/*Search Results*/}
          <SearchResults
            searchResults={searchResults}
            setSearchResults={setSearchResults}
          />
        </>
      ) : (
        <>
          {/*Conversations*/}
          <Conversations />
        </>
      )}
    </aside>
  );
};

export default SidebarChat;
