import express from "express";

import {
  createActivity,
  getAllActivities,
  getActivityById,
  updateActivity,
  deleteActivity,
  joinActivity,
  enrollUserInActivity,
  getParticipantsOfActivity,
  createPetition,
  getPetitions,
} from "../../controllers/spiritualActivities/activityController.js";
import { adminOnly, protect } from "../../middlewares/authMiddleware.js";

const router = express.Router();

// Crear nueva actividad
router.post("/", protect, adminOnly, createActivity);

// Obtener todas las actividades
router.get("/", protect, getAllActivities);

// Obtener una actividad por ID
router.get("/:id", protect, getActivityById);

// Editar una actividad
router.put("/:id", protect, adminOnly, updateActivity);

// Eliminar una actividad
router.delete("/:id", protect, adminOnly, deleteActivity);

// Unirse a una actividad (inscribirse)
router.post("/:id/join", protect, joinActivity);

// Ruta para inscribir a un usuario en una actividad
router.post("/:activityId/join", protect, enrollUserInActivity);

// Ruta para obtener los participantes de una actividad
router.get("/:activityId/participants", protect, getParticipantsOfActivity);

// Ruta para crear peticiones de oración
router.post("/:activityId/petitions", protect, createPetition);

router.get("/:activityId/petitions", protect, getPetitions);

export default router;
