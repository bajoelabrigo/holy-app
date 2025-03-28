import { useState } from "react";
import { Briefcase, BriefcaseBusiness, X } from "lucide-react";
import { formatDate } from "../../utils/dateUtils";

const ExperienceSection = ({ userData, onSave, isOwnProfile }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [experiences, setExperiences] = useState(userData.experience || []);
  const [newExperience, setNewExperience] = useState({
    title: "",
    company: "",
    startDate: "",
    endDate: "",
    description: "",
    currentlyWorking: false,
  });

  const handleAddExperience = () => {
    if (
      newExperience.title &&
      newExperience.company &&
      newExperience.startDate
    ) {
      setExperiences([...experiences, newExperience]);

      setNewExperience({
        title: "",
        company: "",
        startDate: "",
        endDate: "",
        description: "",
        currentlyWorking: false,
      });
    }
  };

  const handleDeleteExperience = (id) => {
    setExperiences(experiences.filter((exp) => exp._id !== id));
  };

  const handleSave = () => {
    onSave({ experience: experiences });
    setIsEditing(false);
  };

  const handleCurrentlyWorkingChange = (e) => {
    setNewExperience({
      ...newExperience,
      currentlyWorking: e.target.ckecked,
      endDate: e.target.checked ? "" : newExperience.endDate,
    });
  };

  return (
    <div className="bg-base-100 shadow rounded-lg p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Experience</h2>
      {experiences.map((exp) => (
        <div key={exp._id} className="mb-4 flex justify-between items-start">
          <div className="flex items-start">
            <Briefcase size={20} className="mr-2 mt-1 text-info" />
            <div>
              <h3 className="font-semibold">{exp.title}</h3>
              <p>{exp.company}</p>
              <p>
                {formatDate(exp.startDate)} -{" "}
                {exp.endDate ? formatDate(exp.endDate) : "Present"}
              </p>
              <p>{exp.description}</p>
            </div>
          </div>
          {isEditing && (
            <button
              onClick={() => handleDeleteExperience(exp._id)}
              className="text-red-500"
            >
              <X size={20} />
            </button>
          )}
        </div>
      ))}

      {isEditing && (
        <div className="mt-4">
          <input
            type="text"
            placeholder="Title"
            value={newExperience.title}
            onChange={(e) =>
              setNewExperience({ ...newExperience, title: e.target.value })
            }
            className="w-full p-2 border rounded mb-2"
          />

          <input
            type="text"
            placeholder="Company"
            value={newExperience.company}
            onChange={(e) =>
              setNewExperience({ ...newExperience, company: e.target.value })
            }
            className="w-full p-2 border rounded mb-2"
          />

          <input
            type="date"
            placeholder="Start Date"
            value={newExperience.startDate}
            onChange={(e) =>
              setNewExperience({ ...newExperience, startDate: e.target.value })
            }
            className="w-full p-2 border rounded mb-2"
          />

          <div className="flex items-center mb-2">
            <input
              type="checkbox"
              id="currentlyWorking"
              checked={newExperience.currentlyWorking}
              onChange={handleCurrentlyWorkingChange}
              className="mr-2"
            />
            <label htmlFor="currentlyWorking">I currently work here</label>
          </div>

          {!newExperience.currentlyWorking && (
            <input
              type="date"
              placeholder="End Date"
              value={newExperience.endDate}
              onChange={(e) =>
                setNewExperience({ ...newExperience, endDate: e.target.value })
              }
              className="w-full p-2 border rounded mb-2"
            />
          )}

          <textarea
            placeholder="Description"
            value={newExperience.description}
            onChange={(e) =>
              setNewExperience({
                ...newExperience,
                description: e.target.value,
              })
            }
            className="w-full p-2 border rounded mb-2"
          />
          <button
            onClick={handleAddExperience}
            className="bg-neutral text-white py-2 px-4 rounded hover:bg-neutral-700 transition duration-300 mb-2"
          >
            Add Experience
          </button>
        </div>
      )}

      {isOwnProfile && (
        <>
          {isEditing ? (
            <button
              onClick={handleSave}
              className="bg-neutral text-white py-2 px-4 rounded hover:bg-neutral-700 transition duration-300"
            >
              Save Changes
            </button>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-neutral text-white py-2 px-4 rounded hover:bg-neutral-700 transition duration-300"
            >
              <span className="flex items-center gap-2 text-lg">
                Exit Experiences
                <BriefcaseBusiness size={24} className="text-info"/>
              </span>
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default ExperienceSection;
