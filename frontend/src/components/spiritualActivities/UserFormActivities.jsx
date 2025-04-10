import { useState } from "react";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

function EnrollActivityForm({ activityId }) {
  const [petitionText, setPetitionText] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!petitionText.trim()) {
      setError("La petición no puede estar vacía.");
      toast.error("La petición no puede estar vacía.", error);
      return;
    }

    try {
      await axiosInstance.post(`/activities/${activityId}/petitions`, {
        petitionText,
      });
      toast.success("Petición de oración enviada con éxito!");
      setPetitionText(""); // Limpiar el campo de texto
    } catch (error) {
      console.error("Error al enviar la petición:", error);
      setError(
        error.response?.data?.message || "Hubo un error al enviar la petición."
      );
      toast.error("Hubo un error al enviar la petición.", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <h3 className="text-xl font-semibold">Pedido de Oración</h3>
      <textarea
        value={petitionText}
        onChange={(e) => setPetitionText(e.target.value)}
        className="w-full mt-2 p-2 border rounded input input-primary input-lg"
        rows="4"
        placeholder="Escribe tu petición de oración aquí..."
      ></textarea>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <button
        type="submit"
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full font-semibold"
      >
        Enviar Petición
      </button>
    </form>
  );
}

export default EnrollActivityForm;
