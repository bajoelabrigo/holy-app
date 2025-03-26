import { useState } from "react";
import { UserRoundPen } from "lucide-react";

const AboutSection = ({ userData, onSave, isOwnProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [about, setAbout] = useState(userData.about || "");

  const handleSave = () => {
    setIsEditing(false);
    onSave({ about });
  };
  return (
    <div className="bg-base-100 shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">About</h2>
      {isOwnProfile && (
        <>
          {isEditing ? (
            <>
              <textarea
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="w-full p-2 border rounded"
                rows="4"
              />
              <button
                onClick={handleSave}
                className="mt-2 bg-neutral text-white py-2 px-4 rounded hover:bg-neutral-700 
								transition duration-300"
              >
                Save
              </button>
            </>
          ) : (
            <>
              <p>{userData.about}</p>
              <button
                onClick={() => setIsEditing(true)}
                className="mt-2 bg-neutral text-white py-2 px-4 rounded hover:bg-neutral-700 
								transition duration-300"
              >
                <div className="flex items-center gap-2 text-lg">
                  Edit
                  <UserRoundPen size={20} className="mr-1 text-info" />
                </div>
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default AboutSection;
