import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

function EditActivityPage() {
  const { id } = useParams(); // ID de la actividad desde la URL
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    type: "oracion",
    startDate: "",
    endDate: "",
  });

  const [loading, setLoading] = useState(true);

  // Traer los datos actuales de la actividad
  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const { data } = await axiosInstance.get(`/activities/${id}`);
        setForm({
          title: data.title,
          description: data.description,
          type: data.type,
          startDate: data.startDate.slice(0, 10),
          endDate: data.endDate.slice(0, 10),
        });
        setLoading(false);
      } catch (error) {
        console.error("Error al cargar actividad:", error);
      }
    };
    fetchActivity();
  }, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosInstance.put(`/activities/${id}`, form);
      toast.success("Actividad actualizada");
      navigate("/activities");
    } catch (err) {
      console.error("Error al actualizar actividad:", err);
      toast.error("No se pudo actualizar la actividad.");
    }
  };

  if (loading) return <div className="text-center">Cargando...</div>;

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
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Guardar cambios
        </button>
      </form>
    </div>
  );
}

export default EditActivityPage;
