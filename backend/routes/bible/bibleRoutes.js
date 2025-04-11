import express from "express";
import {
  getAllBooks,
  getChaptersOfBook,
  getVerse,
  getVersesByChapter,
  searchVerses,
} from "../../controllers/biblie/bibleController.js";

const router = express.Router();

// Ruta para insertar la Biblia
// router.post('/', insertBible);

// Rutas para consultar la Biblia
router.get("/books", getAllBooks); // Obtener todos los libros
router.get("/books/:book/chapters", getChaptersOfBook); // Obtener capítulos del libro
router.get("/books/:book/:chapter/verses", getVersesByChapter); // Obtener versículos de un capítulo
router.get("/books/:book/:chapter/:verse", getVerse); // Obtener versículo específico
router.get("/search", searchVerses); // Buscar por palabra clave

export default router;
