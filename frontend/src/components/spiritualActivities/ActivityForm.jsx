import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

function ActivityForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("oracion");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchActivityDetails = async () => {
        try {
          setLoading(true);
          const response = await axiosInstance.get(`/activities/${id}`);
          const activity = response.data;
          setTitle(activity.title);
          setDescription(activity.description);
          setType(activity.type);
          setStartDate(activity.startDate.split("T")[0]);
          setEndDate(activity.endDate.split("T")[0]);
        } catch (error) {
          console.error("Error fetching activity details:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchActivityDetails();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const activityData = {
      title,
      description,
      type,
      startDate,
      endDate,
    };

    try {
      setLoading(true);

      if (id) {
        await axiosInstance.put(`/activities/${id}`, activityData, {
          withCredentials: true,
        });
        toast.success("Actividad actualizada con éxito!");
      } else {
        await axiosInstance.post("/activities", activityData, {
          withCredentials: true,
        });
        toast.success("Actividad creada con éxito!");
      }

      navigate("/activities"); // Redirigir a la lista de actividades
    } catch (error) {
      console.error("Error submitting activity:", error);
      toast.error("Hubo un error al crear o actualizar la actividad.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-8">
        {id ? "Actualizar Actividad" : "Crear Nueva Actividad"}
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-lg font-medium">
            Título
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-lg font-medium">
            Descripción
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
          />
        </div>

        <div>
          <label htmlFor="type" className="block text-lg font-medium">
            Tipo de Actividad
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          >
            <option value="oracion">Mes de Oración</option>
            <option value="ayuno">Semana de Ayuno</option>
            <option value="estudio">Mes de Estudio Bíblico</option>
          </select>
        </div>

        <div>
          <label htmlFor="startDate" className="block text-lg font-medium">
            Fecha de Inicio
          </label>
          <input
            type="date"
            id="startDate"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div>
          <label htmlFor="endDate" className="block text-lg font-medium">
            Fecha de Fin
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600"
        >
          {loading
            ? "Guardando..."
            : id
            ? "Actualizar Actividad"
            : "Crear Actividad"}
        </button>
      </form>
    </div>
  );
}

export default ActivityForm;
