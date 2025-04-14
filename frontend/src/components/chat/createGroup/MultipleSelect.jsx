import Select from "react-select";

const MultipleSelect = ({
  selectedUsers,
  setSelectedUsers,
  searchResults,
  handleSearch,
}) => {
  return (
    <div className="mt-4">
      <Select
        options={searchResults}
        onChange={setSelectedUsers}
        onKeyDown={(e) => handleSearch(e)}
        placeholder="Search, select users"
        isMulti
        formatOptionLabel={(user) => (
          <div className="flex items-center gap-1">
            <img
              src={user.picture}
              alt=""
              className="w-8 h-8 object-cover rounded-full"
            />
            <span className="text-gray-700">{user.label}</span>
          </div>
        )}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: "transparent",
            background: "transparent",
            textEmphasisColor:"ButtonShadow"
          }),
        }}
      />
    </div>
  );
};

export default MultipleSelect;
