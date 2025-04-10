import { useEffect, useState } from "react";
import { axiosInstance } from "../../lib/axios";

const ParticipantsList = ({ activityId }) => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await axiosInstance.get(
          `/activities/${activityId}/participants`,
          { withCredentials: true }
        );
        setParticipants(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error al obtener participantes:", error);
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [activityId]);

  if (loading) return <p>Cargando participantes...</p>;

  return (
    <div>
      <h2>Participantes</h2>
      <ul>
        {participants.map((participant, index) => (
          <li key={index}>
            <strong>{participant.user.name}</strong>: {participant.petition}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ParticipantsList;
