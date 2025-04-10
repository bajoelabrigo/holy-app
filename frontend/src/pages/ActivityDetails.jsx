import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import EnrollActivityForm from "../components/spiritualActivities/UserFormActivities";
import { HandsPraying } from "@phosphor-icons/react";
import { useSelector } from "react-redux";

function ActivityDetails() {
  const { activityId } = useParams(); // Obtén el ID de la URL
  const { user } = useSelector((state) => state.auth);

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

  const handleDeletePetition = async (petitionId) => {
    if (!confirm("¿Estás seguro de eliminar esta petición?")) return;

    try {
      await axiosInstance.delete(
        `/activities/${activityId}/petitions/${petitionId}`
      );
      setPetitions((prev) => prev.filter((p) => p._id !== petitionId));
    } catch (error) {
      console.error("Error al eliminar:", error);
    }
  };

  const handleEditPetition = (petition) => {
    const nuevoTexto = prompt("Editar petición:", petition.petitionText);
    if (!nuevoTexto || nuevoTexto === petition.petitionText) return;

    axiosInstance
      .patch(`/activities/${activityId}/petitions/${petition._id}`, {
        petitionText: nuevoTexto,
      })
      .then((res) => {
        setPetitions((prev) =>
          prev.map((p) =>
            p._id === petition._id ? { ...p, petitionText: nuevoTexto } : p
          )
        );
      })
      .catch((err) => {
        console.error("Error actualizando petición:", err);
      });
  };

  return (
    <div className="flex flex-col max-w-6xl shadow-2xl p-8">
      <div className="items-center justify-center w-full flex">
        <HandsPraying
          size={100}
          className="text-blue-500 text-center lg:flex hidden"
        />
        <div className="container mx-auto p-4 mb-6 border-b border-b-primary/20">
          <h1 className="text-3xl font-bold mb-4">{activity.title}</h1>
          <div className="lg:flex items-center gap-x-8">
            <p className="text-lg">{activity.description}</p>
            <p className="text-info">
              Desde: {new Date(activity.startDate).toLocaleDateString()}
            </p>
            -
            <p className="text-success">
              Hasta: {new Date(activity.endDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>

      <EnrollActivityForm activityId={activityId} />
      <h2 className="text-xl font-semibold mt-6">Participantes y peticiones</h2>
      <ul className="mt-4 space-y-3">
        {petitions.map((petition) => {
          const isOwner = petition.userId._id === user._id;
          const isAdmin = user.role === "admin";

          return (
            <li
              key={petition._id}
              className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg shadow"
            >
              <img
                src={petition.userId.profilePicture || "/default-avatar.png"}
                alt={petition.userId.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="lg:flex  space-x-4 flex-1 items-center">
                <p className="font-semibold text-info italic">
                  {petition.userId.name}
                </p>
                <p
                  className={`font-semibold ${
                    petition.userId.role === "admin" ? "bg-primary" : ""
                  } px-2 py-0.5 rounded-md italic text-white`}
                >
                  {petition.userId.role}
                </p>
                <p className="text-gray-700 italic mt-1">
                  <span className="text-red-500">Petición: </span>
                  {petition.petitionText}
                </p>
              </div>
              {(isOwner || isAdmin) && (
                <div className="lg:flex hidden gap-2 text-lg">
                  <button
                    onClick={() => handleEditPetition(petition)}
                    className="text-blue-500 hover:underline"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeletePetition(petition._id)}
                    className="text-red-500 hover:underline"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default ActivityDetails;
