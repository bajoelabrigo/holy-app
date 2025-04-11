import React, { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getBooks,
  getChapters,
  getVerses,
  searchKeyword,
  addToFavorites,
  getFavorites,
  removeFromFavorites,
} from "./bibleService";
import toast from "react-hot-toast";

export default function BibleDetail() {
  const [selectedBook, setSelectedBook] = useState("");
  const [selectedChapter, setSelectedChapter] = useState("");
  const [keyword, setKeyword] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [tab, setTab] = useState("explorer");
  const [isSearching, setIsSearching] = useState(false);
  const [copiedVerse, setCopiedVerse] = useState("");

  useEffect(() => {
    setFavorites(getFavorites());
  }, []);

  const { data: books, isLoading: loadingBooks } = useQuery({
    queryKey: ["bible", "books"],
    queryFn: getBooks,
    staleTime: 1000 * 60 * 60,
  });

  const { data: chapters, isLoading: loadingChapters } = useQuery({
    queryKey: ["bible", selectedBook, "chapters"],
    queryFn: () => getChapters(selectedBook),
    enabled: !!selectedBook,
    staleTime: 1000 * 60 * 60,
  });

  const { data: verses, isLoading: loadingVerses } = useQuery({
    queryKey: ["bible", selectedBook, selectedChapter, "verses"],
    queryFn: () => getVerses(selectedBook, selectedChapter),
    enabled: !!selectedBook && !!selectedChapter,
    staleTime: 1000 * 60 * 60,
  });

  const isFavorite = (book, chapter, verse) => {
    return favorites.some(
      (fav) =>
        fav.book === book && fav.chapter === chapter && fav.verse === verse
    );
  };

  const handleToggleFavorite = (book, chapter, verse, text) => {
    if (isFavorite(book, chapter, verse)) {
      removeFromFavorites({ book, chapter, verse });
      toast.error("Versículo Eliminado a favoritos");
    } else {
      addToFavorites({ book, chapter, verse, text });
      toast.success("Versículo agregado de favoritos");
    }
    setFavorites(getFavorites());
  };

  const handleCopy = (id, text) => {
    navigator.clipboard.writeText(text);
    setCopiedVerse(id);
    setTimeout(() => setCopiedVerse(""), 2000);
    toast.success("Versiculo copiado");
  };

  const handleVerseClick = (book, chapter, verse) => {
    setSelectedBook(book);
    setSelectedChapter(chapter);
    setTab("explorer");
  };

  return (
    <div className="p-6 bg-base-100 rounded-lg shadow-lg max-w-6xl">
      {/* Tabs */}
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded ${
            tab === "explorer"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
          onClick={() => setTab("explorer")}
        >
          Explorar
        </button>
        <button
          className={`px-4 py-2 rounded ${
            tab === "search"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
          onClick={() => setTab("search")}
        >
          Buscar
        </button>
        <button
          className={`px-4 py-2 rounded ${
            tab === "favorites"
              ? "bg-blue-500 text-white"
              : "bg-gray-200 text-gray-600"
          }`}
          onClick={() => setTab("favorites")}
        >
          Favoritos
        </button>
      </div>

      {/* Explorador */}
      {tab === "explorer" && (
        <div>
          <div className="grid :grid-cols-3 lg:grid-cols-3 gap-4 mb-4">
            <select
              className="border p-2 rounded "
              value={selectedBook}
              onChange={(e) => {
                setSelectedBook(e.target.value);
                setSelectedChapter("");
              }}
            >
              <option value="" className="text-gray-600">
                Seleccione un libro
              </option>
              {books?.map((book) => (
                <option key={book} value={book} className="text-gray-600">
                  {book}
                </option>
              ))}
            </select>

            <select
              className="border p-2 rounded"
              value={selectedChapter}
              onChange={(e) => setSelectedChapter(e.target.value)}
              disabled={!selectedBook}
            >
              <option value="" className="text-gray-600">
                Capítulo
              </option>
              {chapters?.map((ch) => (
                <option key={ch} value={ch} className="text-gray-600">
                  {ch}
                </option>
              ))}
            </select>

            <div className="flex gap-2 flex-wrap">
              <button
                className=" bg-gray-300 hover:bg-gray-600 hover:text-white text-gray-600 px-3 py-2 rounded disabled:opacity-50"
                disabled={!selectedBook || !selectedChapter}
                onClick={() => {
                  const currentIndex = books?.indexOf(selectedBook);
                  const currentChapter = Number(selectedChapter);

                  if (currentChapter > 1) {
                    setSelectedChapter((prev) => `${currentChapter - 1}`);
                  } else if (currentIndex > 0) {
                    const previousBook = books[currentIndex - 1];
                    getChapters(previousBook).then((prevChapters) => {
                      setSelectedBook(previousBook);
                      setSelectedChapter(
                        `${Math.max(...prevChapters.map(Number))}`
                      );
                    });
                  }
                }}
              >
                ⬅ Anterior
              </button>
              <button className="bg-green-600 hover:bg-green-700  text-white px-4 py-2 rounded disabled:opacity-50">
                {selectedBook} {selectedChapter}
              </button>
              <button
                className="bg-gray-300 text-gray-600 hover:bg-gray-600 hover:text-white px-3 py-2 rounded disabled:opacity-50"
                disabled={!selectedBook || !selectedChapter}
                onClick={() => {
                  const currentIndex = books?.indexOf(selectedBook);
                  const currentChapter = Number(selectedChapter);
                  const lastChapter = Math.max(...(chapters || []).map(Number));

                  if (currentChapter < lastChapter) {
                    setSelectedChapter((prev) => `${currentChapter + 1}`);
                  } else if (currentIndex < books.length - 1) {
                    const nextBook = books[currentIndex + 1];
                    getChapters(nextBook).then((nextChapters) => {
                      setSelectedBook(nextBook);
                      setSelectedChapter("1");
                    });
                  }
                }}
              >
                Siguiente ➡
              </button>
            </div>
          </div>

          {loadingBooks ? (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <span className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></span>
              <p className="text-center text-lg font-semibold">
                Cargando Libros...
              </p>
            </div>
          ) : loadingChapters ? (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <span className="w-6 h-6 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></span>
              <p className="text-center text-lg font-semibold">
                Cargando Capitulos...
              </p>
            </div>
          ) : loadingVerses ? (
            <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
              <span className="w-4 h-4 border-2 border-gray-300 border-t-blue-500 rounded-full animate-spin"></span>
              <p className="text-center text-lg font-semibold">
                Cargando Versiculos...
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {verses &&
                Object.entries(verses).map(([num, text]) => (
                  <div
                    key={num}
                    className="flex justify-between items-center cursor-pointer hover:bg-gray-100 p-2 rounded hover:text-blue-600"
                    onClick={() =>
                      handleVerseClick(selectedBook, selectedChapter, num)
                    }
                  >
                    <p className="ml-4 text-xl">
                      <strong>{num}</strong>. {text}
                    </p>
                    <div className="flex gap-2">
                      <button
                        className={`px-2 py-1 rounded ${
                          isFavorite(selectedBook, selectedChapter, num)
                            ? "bg-yellow-700 text-white"
                            : "bg-yellow-500 text-white"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleToggleFavorite(
                            selectedBook,
                            selectedChapter,
                            num,
                            text
                          );
                        }}
                      >
                        ⭐
                      </button>
                      <button
                        className={`px-2 py-1 rounded text-sm ${
                          copiedVerse ===
                          `${selectedBook}-${selectedChapter}-${num}`
                            ? "bg-green-400 text-white"
                            : "bg-gray-300 text-gray-600"
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleCopy(
                            `${selectedBook}-${selectedChapter}-${num}`,
                            `${selectedBook} ${selectedChapter}:${num} - ${text}`
                          );
                        }}
                      >
                        {copiedVerse ===
                        `${selectedBook}-${selectedChapter}-${num}`
                          ? "Copiado"
                          : "Copiar"}
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      )}

      {/* Buscador */}
      {tab === "search" && (
        <div>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              className="border p-2 rounded w-full text-xl"
              placeholder="Buscar palabra clave"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
              onClick={async () => {
                setIsSearching(true);
                const res = await searchKeyword(keyword);
                setSearchResults(res);
                setIsSearching(false);
              }}
              disabled={isSearching || !keyword}
            >
              {isSearching ? "Buscando..." : "Buscar"}
            </button>
          </div>

          {isSearching ? (
            <p className="text-center text-xl font-semibold">
              Cargando resultados...
            </p>
          ) : (
            <div className="space-y-2">
              {searchResults?.map(({ book, chapter, verse, text }) => (
                <div
                  key={`${book}-${chapter}-${verse}`}
                  className="flex justify-between items-center p-2 border rounded cursor-pointer hover:bg-gray-100 hover:text-gray-600"
                  onClick={() => handleVerseClick(book, chapter, verse)}
                >
                  <div className="text-xl">
                    <strong>
                      {book} {chapter}:{verse}
                    </strong>
                    <p >{text}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      className={`px-2 py-1 rounded ${
                        isFavorite(book, chapter, verse)
                          ? "bg-yellow-700 text-white"
                          : "bg-yellow-500 text-white"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(book, chapter, verse, text);
                      }}
                    >
                      ⭐
                    </button>
                    <button
                      className={`px-2 py-1 rounded text-sm  ${
                        copiedVerse === `${book}-${chapter}-${verse}`
                          ? "bg-green-400 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(
                          `${book}-${chapter}-${verse}`,
                          `${book} ${chapter}:${verse} - ${text}`
                        );
                      }}
                    >
                      {copiedVerse === `${book}-${chapter}-${verse}`
                        ? "Copiado"
                        : "Copiar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Favoritos */}
      {tab === "favorites" && (
        <div className="mt-8">
          <h3 className="text-2xl mb-4 font-semibold">Versículos Favoritos</h3>
          {favorites.length === 0 ? (
            <p>No tienes versículos favoritos.</p>
          ) : (
            <div className="space-y-2">
              {favorites.map(({ book, chapter, verse, text }) => (
                <div
                  key={`${book}-${chapter}-${verse}`}
                  className="flex justify-between items-center cursor-pointer hover:bg-gray-100 hover:text-blue-600 p-2 rounded"
                  onClick={() => handleVerseClick(book, chapter, verse)}
                >
                  <p className="text-xl">
                    <strong>
                      {book} {chapter}:{verse}
                    </strong>{" "}
                    - {text}
                  </p>
                  <div className="flex gap-2">
                    <button
                      className="bg-red-500 text-white px-2 py-1 rounded ml-2"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleFavorite(book, chapter, verse, text);
                      }}
                    >
                      Eliminar
                    </button>
                    <button
                      className={`px-2 py-1 rounded text-sm ${
                        copiedVerse === `${book}-${chapter}-${verse}`
                          ? "bg-green-400 text-white"
                          : "bg-gray-300 text-gray-600"
                      }`}
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(
                          `${book}-${chapter}-${verse}`,
                          `${book} ${chapter}:${verse} - ${text}`
                        );
                      }}
                    >
                      {copiedVerse === `${book}-${chapter}-${verse}`
                        ? "Copiado"
                        : "Copiar"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
