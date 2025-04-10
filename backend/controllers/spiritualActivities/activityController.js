import Activity from "../../models/spiritualActivities/activityModel.js";
import Petition from "../../models/spiritualActivities/petitionModel.js";

// Crear nueva actividad
export const createActivity = async (req, res) => {
  try {
    const { title, description, type, startDate, endDate } = req.body;

    const newActivity = new Activity({
      title,
      description,
      type,
      startDate,
      endDate,
      createdBy: req.user._id,
    });

    await newActivity.save();
    res.status(201).json(newActivity);
  } catch (error) {
    console.error("Error al crear actividad:", error.message);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Obtener todas las actividades
export const getAllActivities = async (req, res) => {
  try {
    const activities = await Activity.find().populate("createdBy", "name");
    res.status(200).json(activities);
  } catch (error) {
    console.error("Error al obtener actividades:", error.message);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Obtener una actividad por ID
export const getActivityById = async (req, res) => {
  try {
    const activity = await Activity.findById(req.params.id)
      .populate("createdBy", "name ")
      .populate("participants.user", "name profilePicture role");

    if (!activity) {
      return res.status(404).json({ message: "Actividad no encontrada" });
    }

    res.status(200).json(activity);
  } catch (error) {
    console.error("Error al obtener actividad:", error.message);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Editar una actividad
export const updateActivity = async (req, res) => {
  try {
    const { title, description, type, startDate, endDate } = req.body;

    const updated = await Activity.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        type,
        startDate,
        endDate,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: "Actividad no encontrada" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error al actualizar actividad:", error.message);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Eliminar una actividad
export const deleteActivity = async (req, res) => {
  try {
    const deleted = await Activity.findByIdAndDelete(req.params.id);

    if (!deleted) {
      return res.status(404).json({ message: "Actividad no encontrada" });
    }

    res.status(200).json({ message: "Actividad eliminada" });
  } catch (error) {
    console.error("Error al eliminar actividad:", error.message);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Inscribirse a una actividad
export const joinActivity = async (req, res) => {
  try {
    const { petition } = req.body;
    const userId = req.user._id;
    const activity = await Activity.findById(req.params.id);

    if (!activity) {
      return res.status(404).json({ message: "Actividad no encontrada" });
    }

    const alreadyJoined = activity.participants.find((p) =>
      p.user.equals(userId)
    );

    if (alreadyJoined) {
      return res
        .status(400)
        .json({ message: "Ya estás inscrito en esta actividad" });
    }

    activity.participants.push({ user: userId, petition });
    await activity.save();

    res.status(200).json({ message: "Inscripción exitosa" });
  } catch (error) {
    console.error("Error al unirse a la actividad:", error.message);
    res.status(500).json({ message: "Error del servidor" });
  }
};

// Ruta para inscribir a un usuario en una actividad
export const enrollUserInActivity = async (req, res) => {
  try {
    const { activityId } = req.params;
    const { petition } = req.body; // Puede ser una petición de oración o reflexión

    // Asegúrate de que el usuario esté autenticado (usando middleware auth)
    const userId = req.user._id;

    // Busca la actividad por su ID
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ error: "Actividad no encontrada" });
    }

    // Verifica si el usuario ya está inscrito
    const isAlreadyEnrolled = activity.participants.some(
      (participant) => participant.user.toString() === userId.toString()
    );
    if (isAlreadyEnrolled) {
      return res
        .status(400)
        .json({ error: "Ya estás inscrito en esta actividad" });
    }

    // Agrega al usuario como participante
    activity.participants.push({
      user: userId,
      petition: petition || "", // La petición puede ser opcional
    });

    // Guarda los cambios en la actividad
    await activity.save();

    res.status(200).json({ message: "Usuario inscrito exitosamente" });
  } catch (error) {
    console.error("Error al inscribir usuario en actividad:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Ruta para obtener los usuarios inscritos en una actividad
export const getParticipantsOfActivity = async (req, res) => {
  try {
    const { activityId } = req.params;

    // Encuentra la actividad
    const activity = await Activity.findById(activityId).populate({
      path: "participants.user", // Poblamos el campo 'user' para obtener detalles completos del usuario
      select: "name email profilePicture", // Seleccionamos solo los campos necesarios
    });

    if (!activity) {
      return res.status(404).json({ error: "Actividad no encontrada" });
    }

    // Devolvemos la lista de participantes
    const participants = activity.participants.map((participant) => ({
      user: participant.user,
      petition: participant.petition,
    }));

    res.status(200).json(participants);
  } catch (error) {
    console.error("Error al obtener los participantes:", error.message);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const createPetition = async (req, res) => {
  try {
    const { activityId } = req.params;
    const { petitionText } = req.body;
    const userId = req.user._id; // Obtén el ID del usuario autenticado

    // Verificar si el usuario está inscrito en la actividad
    const activity = await Activity.findById(activityId);
    if (!activity) {
      return res.status(404).json({ message: "Actividad no encontrada" });
    }

    const isUserEnrolled = activity.participants.some(
      (participant) => participant.user.toString() === userId.toString()
    );

    if (!isUserEnrolled) {
      return res
        .status(403)
        .json({ message: "No estás inscrito en esta actividad" });
    }

    // Crear la nueva petición de oración
    const petition = new Petition({
      activityId,
      userId,
      petitionText,
    });

    await petition.save();

    res
      .status(201)
      .json({ message: "Petición de oración creada exitosamente" });
  } catch (error) {
    console.error("Error en createPetition:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const getPetitions = async (req, res) => {
  try {
    const petitions = await Petition.find({ activityId: req.params.activityId })
      .populate("userId", "-password") // Poblamos el nombre del usuario
      .sort({ createdAt: -1 }); // Ordenamos las peticiones por fecha
    res.status(200).json(petitions);
  } catch (error) {
    console.error("Error al obtener peticiones:", error.message);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};
