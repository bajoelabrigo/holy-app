import React, { useEffect, useState } from "react";
import { getBooks, getChapters, getVerses } from "./bibleService";
import { Link } from "react-router-dom";

export default function RandomVerses() {
  const [verses, setVerses] = useState([]);
  const [loading, setLoading] = useState(false);

  const getRandomVerses = async () => {
    setLoading(true);
    const books = await getBooks();
    const result = [];

    for (let i = 0; i < 3; i++) {
      const randomBook = books[Math.floor(Math.random() * books.length)];
      const chapters = await getChapters(randomBook);
      const randomChapter =
        chapters[Math.floor(Math.random() * chapters.length)];
      const versesData = await getVerses(randomBook, randomChapter);
      const verseNumbers = Object.keys(versesData);
      const randomVerseNumber =
        verseNumbers[Math.floor(Math.random() * verseNumbers.length)];
      const verseText = versesData[randomVerseNumber];

      result.push({
        book: randomBook,
        chapter: randomChapter,
        verse: randomVerseNumber,
        text: verseText,
      });
    }

    const today = new Date().toISOString().split("T")[0];
    localStorage.setItem(
      "dailyVerses",
      JSON.stringify({ date: today, verses: result })
    );
    setVerses(result);
    setLoading(false);
  };

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("dailyVerses"));
    const today = new Date().toISOString().split("T")[0];

    if (saved && saved.date === today) {
      setVerses(saved.verses);
    } else {
      getRandomVerses();
    }
  }, []);

  if (verses.length === 0) {
    return (
      <p className="text-center text-base-content opacity-70">
        Cargando versículos...
      </p>
    );
  }

  return (
    <div className="p-4 border rounded shadow bg-base-200 text-base-content mt-4">
      <h3 className="text-lg font-bold mb-4">Versículos del día</h3>
      {verses.map((v, i) => (
        <p key={i} className="mb-2">
          <strong>
            {v.book} {v.chapter}:{v.verse}
          </strong>{" "}
          — {v.text}
        </p>
      ))}
      <div className="flex items-center justify-center gap-2 mt-4">
        <button
          className="btn btn-warning btn-sm"
          onClick={getRandomVerses}
          disabled={loading}
        >
          {loading ? "Buscando..." : "Actualizar"}
        </button>
        <Link to="/bible">
          <button className="btn btn-primary btn-sm">Ir a la Biblia</button>
        </Link>
      </div>
    </div>
  );
}
