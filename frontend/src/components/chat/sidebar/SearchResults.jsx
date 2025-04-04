import Contact from "./Contact";

function SearchResults({ searchResults, setSearchResults }) {
  return (
    <div className="w-full convos scrollbar">
      <div>
        {/*Heading */}
        <div className="flex flex-col px-8 pt-8">
          <h1 className="font-extralight text-lg text-info">Contacts</h1>
          <span className="w-full mt-4 ml-10 border-b "></span>
        </div>
        {/*Results */}
        <ul>
          {searchResults &&
            searchResults.map((user) => (
              <Contact
                contact={user}
                key={user._id}
                setSearchResults={setSearchResults}
              />
            ))}
        </ul>
      </div>
    </div>
  );
}

export default SearchResults;
