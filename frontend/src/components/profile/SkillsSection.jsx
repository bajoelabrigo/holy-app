import { useState } from "react";
import { NotebookText, X } from "lucide-react";

const SkillsSection = ({ userData, onSave, isOwnProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [skills, setSkills] = useState(userData.skills || []);
  const [newSkill, setNewSkill] = useState("");

  const handleAddSkill = () => {
    if (newSkill && !skills.includes(newSkill)) {
      setSkills([...skills, newSkill]);
      setNewSkill("");
    }
  };

  const handleDeleteSkill = (skill) => {
    setSkills(skills.filter((s) => s !== skill));
  };

  const handleSave = () => {
    onSave({ skills });
    setIsEditing(false);
  };

  return (
    <div className="bg-base-100 shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-4">Skills</h2>
      <div className="flex flex-wrap">
        {skills.map((skill, index) => (
          <span
            key={index}
            className="bg-base-300 px-3 py-1 rounded-full text-sm mr-2 flex items-center mb-4"
          >
            {skill}

            {isEditing && (
              <button
                onClick={() => handleDeleteSkill(skill)}
                className="ml-2 text-red-500"
              >
                <X size={20} />
              </button>
            )}
          </span>
        ))}
      </div>

      {isEditing && (
        <div className="mt-4 flex gap-4">
          <input
            type="text"
            placeholder="New Skill"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddSkill()}
            className="flex flex-1 p-2 border rounded"
          />
          <button
            onClick={handleAddSkill}
            className="bg-neutral text-white py-2 px-4 rounded hover:bg-neutral-700 transition duration-300"
          >
            Add Skill
          </button>
        </div>
      )}

      {isOwnProfile && (
        <>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-neutral text-white py-2 px-4 rounded hover:bg-neutral-700 transition duration-300 mt-2"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-neutral text-white py-2 px-4 rounded hover:bg-neutral-700 transition duration-300 mb-2"
            >
              <div className="flex items-center gap-2 text-lg">
                Edit Skills
                <NotebookText size={20} className="mr-1 text-info" />
              </div>
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default SkillsSection;
