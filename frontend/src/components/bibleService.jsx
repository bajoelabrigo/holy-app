import { axiosInstance } from "../lib/axios";

// Obtener todos los libros de la Biblia
export const getBooks = async () => {
  try {
    const response = await axiosInstance.get("/bible/books");
    return response.data;
  } catch (error) {
    console.error("Error al obtener los libros:", error);
    throw error;
  }
};

// Obtener los capítulos de un libro específico
export const getChapters = async (book) => {
  try {
    const response = await axiosInstance.get(`/bible/books/${book}/chapters`);
    return response.data;
  } catch (error) {
    console.error("Error al obtener los capítulos:", error);
    throw error;
  }
};

// Obtener los versículos de un capítulo específico
export const getVerses = async (book, chapter) => {
  try {
    const response = await axiosInstance.get(
      `/bible/books/${book}/${chapter}/verses`
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener los versículos:", error);
    throw error;
  }
};

// Obtener un versículo específico
export const getVerse = async (book, chapter, verse) => {
  try {
    const response = await axiosInstance.get(
      `/bible/books/${book}/${chapter}/${verse}`
    );
    return response.data;
  } catch (error) {
    console.error("Error al obtener el versículo:", error);
    throw error;
  }
};

// Buscar por palabra clave
export const searchKeyword = async (keyword) => {
  try {
    const response = await axiosInstance.get("/bible/search", {
      params: { keyword },
    });
    return response.data;
  } catch (error) {
    console.error("Error al buscar por palabra clave:", error);
    throw error;
  }
};

// Agregar versículos a favoritos
export const addToFavorites = (verse) => {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  favorites.push(verse);
  localStorage.setItem("favorites", JSON.stringify(favorites));
};

// Obtener los favoritos guardados
export const getFavorites = () => {
  return JSON.parse(localStorage.getItem("favorites")) || [];
};

// Eliminar un versículo de favoritos
export const removeFromFavorites = (verseToRemove) => {
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];
  const updatedFavorites = favorites.filter(
    (verse) =>
      verse.book !== verseToRemove.book ||
      verse.chapter !== verseToRemove.chapter ||
      verse.verse !== verseToRemove.verse
  );
  localStorage.setItem("favorites", JSON.stringify(updatedFavorites));
};
