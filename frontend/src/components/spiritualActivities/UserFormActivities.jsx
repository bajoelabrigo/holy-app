import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { axiosInstance } from "../../lib/axios";
import toast from "react-hot-toast";

function EnrollActivityForm({ activityId }) {
  const [petitionText, setPetitionText] = useState("");
  const [error, setError] = useState("");
  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: async () => {
      return await axiosInstance.post(`/activities/${activityId}/petitions`, {
        petitionText,
      });
    },
    onSuccess: () => {
      toast.success("Petición de oración enviada con éxito!");
      setPetitionText(""); // Limpiar campo
      setError("");

      // ✅ Refrescar lista de peticiones y participantes si se están usando useQuery
      queryClient.invalidateQueries({ queryKey: ["petitions", activityId] });
      queryClient.invalidateQueries({ queryKey: ["participants", activityId] });
    },
    onError: (err) => {
      const msg =
        err.response?.data?.message || "Hubo un error al enviar la petición.";
      toast.error(msg);
      setError(msg);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!petitionText.trim()) {
      const msg = "La petición no puede estar vacía.";
      setError(msg);
      toast.error(msg);
      return;
    }

    mutate();
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
        disabled={isPending}
        className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-full font-semibold disabled:opacity-50"
      >
        {isPending ? "Enviando..." : "Enviar Petición"}
      </button>
    </form>
  );
}

export default EnrollActivityForm;
