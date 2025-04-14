import React, { useEffect, useState } from "react";
import { getBooks, getChapters, getVerses } from "./bibleService";
import { Link } from "react-router-dom";

export default function RandomVerse() {
  const [verseData, setVerseData] = useState(null);
  const [loading, setLoading] = useState(false);

  const getRandomVerse = async () => {
    setLoading(true);
    const books = await getBooks();
    const randomBook = books[Math.floor(Math.random() * books.length)];
    const chapters = await getChapters(randomBook);
    const randomChapter = chapters[Math.floor(Math.random() * chapters.length)];
    const verses = await getVerses(randomBook, randomChapter);
    const verseNumbers = Object.keys(verses);
    const randomVerseNumber =
      verseNumbers[Math.floor(Math.random() * verseNumbers.length)];
    const verseText = verses[randomVerseNumber];

    const newVerse = {
      book: randomBook,
      chapter: randomChapter,
      verse: randomVerseNumber,
      text: verseText,
    };

    localStorage.setItem("randomVerse", JSON.stringify(newVerse));
    setVerseData(newVerse);
    setLoading(false);
  };

  useEffect(() => {
    const saved = localStorage.getItem("randomVerse");
    if (saved) {
      setVerseData(JSON.parse(saved));
    } else {
      getRandomVerse();
    }
  }, []);

  if (!verseData) {
    return <p className="text-center text-gray-500">Cargando versículo...</p>;
  }

  return (
    <div className="p-4 border rounded shadow bg-yellow-50 mt-4">
      <h3 className="text-lg font-bold mb-2 text-yellow-800">
        Versículo del día
      </h3>
      <p className="mb-2">
        <strong>
          {verseData.book} {verseData.chapter}:{verseData.verse}
        </strong>{" "}
        — {verseData.text}
      </p>
      <div className="flex items-center justify-center gap-2">
        <button
          className="px-4 py-2 bg-yellow-600 text-white rounded disabled:opacity-50"
          onClick={getRandomVerse}
          disabled={loading}
        >
          {loading ? "Buscando..." : "Otro versículo"}
        </button>
        <Link to="/bible">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50 cursor-pointer"
           
          >
           Ir a la Biblia
          </button>
        </Link>
      </div>
    </div>
  );
}
