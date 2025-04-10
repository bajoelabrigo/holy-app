import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import { axiosInstance } from "../../lib/axios";
import { Church } from "@phosphor-icons/react";

function Activities() {
  const { user } = useSelector((state) => state.auth);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); // Inicializamos el hook para navegar

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await axiosInstance.get("/activities");
        setActivities(response.data);
      } catch (error) {
        console.error("Error fetching activities:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchActivities();
  }, []);

  const handleJoinActivity = async (activityId) => {
    try {
      await axiosInstance.post(`/activities/${activityId}/join`);
      alert("Te has inscrito con éxito!");
    } catch (error) {
      console.error("Error joining activity:", error);
      toast.error(
        error.response && error.response.data && error.response.data.message
      );
    }
  };

  const handleViewActivityDetails = (activityId) => {
    navigate(`/activity/${activityId}`); // Redirige a la página de detalles con el ID
  };

  const handleDeleteActivity = async (activityId) => {
  try {
    await axiosInstance.delete(`/activities/${activityId}`);
    toast.success("Actividad eliminada con éxito!");
    navigate("/activities");
  } catch (error) {
    console.error("Error deleting activity:", error);
    alert("Hubo un error al eliminar la actividad.");
  }
};

  return (
    <div>
      <h1 className="text-3xl font-bold text-center mb-8">
        Actividades Espirituales
      </h1>

      {loading ? (
        <div className="text-center">Cargando actividades...</div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {activities.map((activity) => (
            <div
              key={activity._id}
              className="bg-base-100 shadow-lg rounded-lg p-4 space-y-1 "
            >
              <h2 className="text-2xl font-semibold ">{activity.title}</h2>
              <div className="flex items-center">
                <div className="px-2">
                  <Church size={100} className="" />
                </div>
                <div className="flex flex-col">
                  <p className="text">{activity.description}</p>
                  <p className="text-info">
                    Desde: {new Date(activity.startDate).toLocaleDateString()}
                  </p>
                  <p className="text-success">
                    Hasta: {new Date(activity.endDate).toLocaleDateString()}
                  </p>
                </div>
              </div>
              <div className="flex flex-wrap items-center  gap-2">
                <button
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                  onClick={() => handleJoinActivity(activity._id)}
                >
                  Unirme
                </button>
                <button
                  className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
                  onClick={() => handleViewActivityDetails(activity._id)} // Aquí se llama al método para ver detalles
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
                      onClick={() => handleDeleteActivity(activity._id)}
                      className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Activities;
