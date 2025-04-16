import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

function ActivityForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState("oracion");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // ✅ useQuery para cargar datos si es edición
  const { data: activityData, isLoading } = useQuery({
    queryKey: ["activity", id],
    queryFn: async () => {
      const res = await axiosInstance.get(`/activities/${id}`);
      return res.data;
    },
    enabled: !!id, // Solo se ejecuta si hay un ID (modo edición)
    onSuccess: (activity) => {
      setTitle(activity.title);
      setDescription(activity.description);
      setType(activity.type);
      setStartDate(activity.startDate.split("T")[0]);
      setEndDate(activity.endDate.split("T")[0]);
    },
  });

  // ✅ Mutación para crear o actualizar
  const { mutate: saveActivity, isPending } = useMutation({
    mutationFn: async (activityData) => {
      if (id) {
        return await axiosInstance.put(`/activities/${id}`, activityData);
      } else {
        return await axiosInstance.post("/activities", activityData);
      }
    },
    onSuccess: () => {
      toast.success(
        id ? "Actividad actualizada con éxito!" : "Actividad creada con éxito!"
      );
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      navigate("/activities");
    },
    onError: () => {
      toast.error("Hubo un error al crear o actualizar la actividad.");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    saveActivity({ title, description, type, startDate, endDate });
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
            className="w-full p-3 border border-gray-300 rounded-lg text-xl"
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
            className="w-full p-3 border border-gray-300 rounded-lg text-xl"
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
            className="w-full p-3 border border-gray-300 rounded-lg text-xl"
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
            className="w-full p-3 border border-gray-300 rounded-lg text-xl"
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
            className="w-full p-3 border border-gray-300 rounded-lg text-xl"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 text-xl"
        >
          {isPending
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
