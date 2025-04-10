import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import EnrollActivityForm from "../components/spiritualActivities/UserFormActivities";
import { HandsPraying } from "@phosphor-icons/react";

function ActivityDetails() {
  const { activityId } = useParams(); // Obtén el ID de la URL

  const [activity, setActivity] = useState(null);
  const [petitions, setPetitions] = useState([]); // Guardar las peticiones de oración

  useEffect(() => {
    const fetchActivityDetails = async () => {
      try {
        const response = await axiosInstance.get(`/activities/${activityId}`);
        setActivity(response.data);
      } catch (error) {
        console.error("Error fetching activity details:", error);
      }
    };

    const fetchPetitions = async () => {
      try {
        const response = await axiosInstance.get(
          `/activities/${activityId}/petitions`
        );
        setPetitions(response.data);
      } catch (error) {
        console.error("Error fetching petitions:", error);
      }
    };

    fetchActivityDetails();
    fetchPetitions();
  }, [activityId]);

  if (!activity) return <div>Cargando detalles...</div>;

  return (
    <div className="flex flex-col max-w-6xl shadow-2xl p-8">
      <div className="items-center justify-center w-full flex">
        <HandsPraying size={100} className="text-blue-500 text-center" />
        <div className="container mx-auto p-4 mb-6 border-b border-b-primary/20">
          <h1 className="text-3xl font-bold mb-4">{activity.title}</h1>
          <div className="flex items-center gap-x-8">
            <p className="text-lg">{activity.description}</p>
            <p className="text-info">
              Desde: {new Date(activity.startDate).toLocaleDateString()}
            </p>
            -
            <p className="text-secondary">
              Hasta: {new Date(activity.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <EnrollActivityForm activityId={activityId} />
      <h2 className="text-xl font-semibold mt-6">Participantes</h2>
      <ul className="mt-4 space-y-3">
        {activity.participants.map((participant) => (
          <li
            key={participant.user._id}
            className="flex items-start gap-4 bg-gray-100 p-4 rounded-lg shadow"
          >
            <img
              src={participant.user.profilePicture || "/default-avatar.png"}
              alt={participant.user.name}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex gap-4">
              <p className="font-semibold text-info italic">
                {participant.user.name}
              </p>
              <p
                className={`font-semibold ${
                  participant.user.role === "admin" ? "bg-primary" : ""
                }  px-2 py-0.5 rounded-md italic text-white`}
              >
                {participant.user.role}
              </p>

              <p className="text-gray-700 italic">
                Petición: {participant.petition || "No ha escrito una petición"}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ActivityDetails;
