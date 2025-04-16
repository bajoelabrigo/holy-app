import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

function EditActivityPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "oracion",
    startDate: "",
    endDate: "",
  });

  // 🔍 Cargar datos de la actividad
  const { isLoading } = useQuery({
    queryKey: ["activity", id],
    queryFn: async () => {
      const { data } = await axiosInstance.get(`/activities/${id}`);
      return data;
    },
    onSuccess: (data) => {
      setForm({
        title: data.title,
        description: data.description,
        type: data.type,
        startDate: data.startDate.slice(0, 10),
        endDate: data.endDate.slice(0, 10),
      });
    },
  });

  // ✏️ Mutación para actualizar
  const { mutate: updateActivity, isPending } = useMutation({
    mutationFn: async () => {
      return await axiosInstance.put(`/activities/${id}`, form);
    },
    onSuccess: () => {
      toast.success("Actividad actualizada");
      queryClient.invalidateQueries({ queryKey: ["activities"] });
      navigate("/activities");
    },
    onError: () => {
      toast.error("No se pudo actualizar la actividad.");
    },
  });

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    updateActivity();
  };

  if (isLoading) return <div className="text-center">Cargando...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 bg-white shadow-lg p-6 rounded-xl">
      <h2 className="text-2xl font-bold mb-4 text-center">Editar Actividad</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Título"
          className="w-full border rounded p-2"
          required
        />
        <textarea
          name="description"
          value={form.description}
          onChange={handleChange}
          placeholder="Descripción"
          className="w-full border rounded p-2"
        />
        <select
          name="type"
          value={form.type}
          onChange={handleChange}
          className="w-full border rounded p-2"
        >
          <option value="oracion">Oración</option>
          <option value="ayuno">Ayuno</option>
          <option value="estudio">Estudio Bíblico</option>
        </select>
        <input
          type="date"
          name="startDate"
          value={form.startDate}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
        <input
          type="date"
          name="endDate"
          value={form.endDate}
          onChange={handleChange}
          className="w-full border rounded p-2"
          required
        />
        <button
          type="submit"
          disabled={isPending}
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          {isPending ? "Guardando..." : "Guardar cambios"}
        </button>
      </form>
    </div>
  );
}

export default EditActivityPage;
