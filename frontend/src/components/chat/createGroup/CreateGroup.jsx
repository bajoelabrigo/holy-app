import { useContext, useState } from "react";
import ClipLoader from "react-spinners/ClipLoader";
import { createGroupChat } from "./createGroupService";
import toast from "react-hot-toast";
import { Check, MessageCircle, User, Variable, X } from "lucide-react";
import { HelpersContext } from "../../../../context/helpersContext";
import { axiosInstance } from "../../../lib/axios";
import MultipleSelect from "./MultipleSelect";
import UnderlineInput from "./UnderlineInput";

function CreateGroup({ onGroupCreated }) {
  const { setShowCreateGroup } = useContext(HelpersContext);
  const [name, setName] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    if (e.target.value && e.key === "Enter") {
      setSearchResults([]);
      try {
        const { data } = await axiosInstance.get(
          `/users?search=${e.target.value}`
        );

        const formatted = data.map((user) => ({
          value: user._id,
          label: user.name,
          picture: user.profilePicture,
        }));

        setSearchResults(formatted);
      } catch (error) {
        console.log(error?.response?.data?.message || error.message);
        toast.error("Error al buscar usuarios");
      }
    } else {
      setSearchResults([]);
    }
  };

  const createGroupHandler = async (e) => {
    e.preventDefault();
    if (selectedUsers.length < 2) return toast.error("Minimo 2 usuarios");

    setLoading(true);
    try {
      const { data } = await createGroupChat({
        name,
        participants: selectedUsers.map((u) => u.value),
      });

      toast.success("Grupo creado");
      if (onGroupCreated) onGroupCreated(data);
      setShowCreateGroup(false);
    } catch (error) {
      toast.error(error.response && error.response.data && error.response.data.message);

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="createGroupAnimation relative flex0030 h-full ">
      <div className="mt-5">
        <button
          className="btnChat w-6 h-6"
          onClick={() => setShowCreateGroup(false)}
        >
          <X size={28} color="white" className="bg-red-500 rounded-full p-1" />
        </button>

        <UnderlineInput name={name} setName={setName} />

        <MultipleSelect
          selectedUsers={selectedUsers}
          searchResults={searchResults}
          setSelectedUsers={setSelectedUsers}
          handleSearch={handleSearch}
        />

        <div className="absolute bottom-1/3 left-1/2 -translate-x-1/2">
          <button
            className="btnChat  bg-green-500 scale-150 hover:bg-green-600 rounded-full p-2"
            onClick={createGroupHandler}
            disabled={loading}
          >
            {loading ? (
              <ClipLoader className="fill-white mt-2 h-full" />
            ) : (
              <Check color="#E9EDEF" size={40} />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

export default CreateGroup;
