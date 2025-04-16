import { useQuery } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";

const fetchParticipants = async (activityId) => {
  const res = await axiosInstance.get(`/activities/${activityId}/participants`);
  // console.log("🧾 Datos crudos desde backend:", res.data);
  return res.data;
};

const ParticipantsList = ({ activityId }) => {
  const {
    data: participants = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["participants", activityId],
    queryFn: () => fetchParticipants(activityId),
    enabled: !!activityId,
  });

  if (isLoading) return <p className="text-center">Cargando participantes...</p>;
  if (isError) return <p className="text-center text-red-500">Error al cargar participantes.</p>;

  // console.log("participants", participants)
  // console.log("🧩 activityId:", activityId);

  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">Participantes</h2>
      <ul className="space-y-2">
        {participants.map((participant, i) => (
          <li key={i} className="bg-base-100 p-3 rounded shadow">
            <strong>{participant.user?.name}</strong>
            {participant.petition && (
              <p className="text-sm text-gray-500 mt-1">{participant.petition}</p>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ParticipantsList;
