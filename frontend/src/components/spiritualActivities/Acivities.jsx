import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import { Church } from "@phosphor-icons/react";
import ShareButton from "../ShareButtons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

function Activities() {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ✅ Obtener actividades con useQuery
  const { data: activities = [], isLoading } = useQuery({
    queryKey: ["activities"],
    queryFn: async () => {
      const res = await axiosInstance.get("/activities");
      return res.data;
    },
  });

  // ✅ Unirse a una actividad (con toast)
  const joinActivity = useMutation({
    mutationFn: (activityId) =>
      axiosInstance.post(`/activities/${activityId}/join`),
    onSuccess: () => {
      toast.success("Te has inscrito con éxito!");
    },
    onError: (error) => {
      toast.error(
        error.response?.data?.message || "Error al unirse a la actividad"
      );
    },
  });

  const deleteActivity = useMutation({
    mutationFn: (activityId) =>
      axiosInstance.delete(`/activities/${activityId}`),
    onSuccess: () => {
      toast.success("Actividad eliminada con éxito!");
      queryClient.invalidateQueries({ queryKey: ["activities"] }); // Refrescar lista
    },
    onError: () => {
      toast.error("Hubo un error al eliminar la actividad.");
    },
  });

  return (
    <div>
      {isLoading ? (
        <div className="text-center">Cargando actividades...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {activities.map((activity) => (
            <div
              key={activity._id}
              className="flex flex-col max-w-6xl bg-base-200 shadow-2xl rounded-lg p-4 space-y-1"
            >
              <h2 className="text-2xl font-semibold">{activity.title}</h2>
              <div className="flex items-center">
                <div className="px-2">
                  <Church size={100} />
                </div>
                <div className="flex flex-col">
                  <p>{activity.description}</p>
                  <p className="text-info">
                    Desde: {new Date(activity.startDate).toLocaleDateString()}
                  </p>
                  <p className="text-success">
                    Hasta: {new Date(activity.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <button
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  onClick={() => joinActivity.mutate(activity._id)}
                >
                  Unirme
                </button>
                <button
                  className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                  onClick={() => navigate(`/activity/${activity._id}`)}
                >
                  Detalles
                </button>
                {user?.role === "admin" && (
                  <div className="flex gap-2 mt-4 flex-wrap">
                    <button
                      onClick={() =>
                        navigate(`/activities/edit/${activity._id}`)
                      }
                      className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => deleteActivity.mutate(activity._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <ShareButton />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Activities;
