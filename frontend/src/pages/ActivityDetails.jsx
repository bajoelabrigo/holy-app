import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import EnrollActivityForm from "../components/spiritualActivities/UserFormActivities";
import { HandsPraying } from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import ParticipantsList from "../components/spiritualActivities/Participants";
import toast from "react-hot-toast";

function ActivityDetails() {
  const { activityId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const queryClient = useQueryClient();

  const {
    data: activity,
    isLoading: activityLoading,
  } = useQuery({
    queryKey: ["activity", activityId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/activities/${activityId}`);
      return data;
    },
    enabled: !!activityId,
  });

  const {
    data: petitions = [],
    isLoading: petitionsLoading,
  } = useQuery({
    queryKey: ["petitions", activityId],
    queryFn: async () => {
      const { data } = await axiosInstance.get(
        `/activities/${activityId}/petitions`
      );
      return data;
    },
    enabled: !!activityId,
  });

  const deletePetition = useMutation({
    mutationFn: async (petitionId) => {
      await axiosInstance.delete(
        `/activities/${activityId}/petitions/${petitionId}`
      );
    },
    onSuccess: (_, petitionId) => {
      queryClient.setQueryData(["petitions", activityId], (old) =>
        old.filter((p) => p._id !== petitionId)
      );
      toast.success("Peticion eliminada");
    },
    onError: () => toast.error("Error al eliminar peticion"),
  });

  const editPetition = useMutation({
    mutationFn: async ({ petitionId, petitionText }) => {
      await axiosInstance.patch(
        `/activities/${activityId}/petitions/${petitionId}`,
        { petitionText }
      );
    },
    onSuccess: (_, { petitionId, petitionText }) => {
      queryClient.setQueryData(["petitions", activityId], (old) =>
        old.map((p) =>
          p._id === petitionId ? { ...p, petitionText } : p
        )
      );
      toast.success("Peticion actualizada");
    },
    onError: () => toast.error("Error al editar peticion"),
  });

  if (activityLoading || petitionsLoading)
    return <div className="text-center">Cargando detalles...</div>;

  const handleDeletePetition = (petitionId) => {
    if (confirm("¿Estás seguro de eliminar esta petición?")) {
      deletePetition.mutate(petitionId);
    }
  };

  const handleEditPetition = (petition) => {
    const nuevoTexto = prompt("Editar petición:", petition.petitionText);
    if (!nuevoTexto || nuevoTexto === petition.petitionText) return;
    editPetition.mutate({
      petitionId: petition._id,
      petitionText: nuevoTexto,
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
      <ParticipantsList activityId={activityId} />

      <h2 className="text-xl font-semibold mt-6">Peticiones</h2>
      <ul className="mt-4 space-y-3">
        {petitions.map((petition) => {
          const isOwner = petition.userId?._id === user?._id;
          const isAdmin = user?.role === "admin";

          return (
            <li
              key={petition._id}
              className="flex items-center gap-4 bg-gray-100 p-4 rounded-lg shadow"
            >
              <img
                src={
                  petition.userId?.profilePicture || "/profile.png"
                }
                alt={petition.userId?.name}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="lg:flex  space-x-4 flex-1 items-center">
                <p className="font-semibold text-info italic">
                  {petition.userId?.name}
                </p>
                <p
                  className={`font-semibold ${
                    petition.userId?.role === "admin" ? "bg-blue-500 text-white" : ""
                  } px-2 py-0.5 rounded-md italic`}
                >
                  {petition.userId?.role}
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