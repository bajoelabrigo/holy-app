import Bible from "../../models/bible/bibleModel.js";
// import fs from 'fs';
// import path from 'path';

// Obtener todos los libros
export const getAllBooks = async (req, res) => {
  try {
    const bible = await Bible.findOne({});
    const books = Object.keys(bible.bible_data);
    res.json(books);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener los libros", error: err });
  }
};

// Obtener todos los capítulos de un libro
export const getChaptersOfBook = async (req, res) => {
  const { book } = req.params;
  try {
    const bible = await Bible.findOne({});
    if (!bible.bible_data[book]) {
      return res.status(404).json({ message: "Libro no encontrado" });
    }
    const chapters = Object.keys(bible.bible_data[book]);
    res.json(chapters);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener los capítulos", error: err });
  }
};

// Obtener todos los versículos de un capítulo
export const getVersesOfChapter = async (req, res) => {
  const { book, chapter } = req.params;
  try {
    const bible = await Bible.findOne({});
    if (!bible.bible_data[book] || !bible.bible_data[book][chapter]) {
      return res
        .status(404)
        .json({ message: "Libro o capítulo no encontrado" });
    }
    const verses = bible.bible_data[book][chapter];
    res.json(verses);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener los versículos", error: err });
  }
};

// Obtener un versículo específico
export const getVerse = async (req, res) => {
  const { book, chapter, verse } = req.params;
  try {
    const bible = await Bible.findOne({});
    if (
      !bible.bible_data[book] ||
      !bible.bible_data[book][chapter] ||
      !bible.bible_data[book][chapter][verse]
    ) {
      return res.status(404).json({ message: "Versículo no encontrado" });
    }
    const verseText = bible.bible_data[book][chapter][verse];
    res.json({ verse: verseText });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al obtener el versículo", error: err });
  }
};

// Buscar por palabra clave en los versículos
export const searchByKeyword = async (req, res) => {
  const { keyword } = req.query;
  try {
    const bible = await Bible.findOne({});
    const results = [];

    for (const book in bible.bible_data) {
      for (const chapter in bible.bible_data[book]) {
        for (const verse in bible.bible_data[book][chapter]) {
          const verseText = bible.bible_data[book][chapter][verse];
          if (verseText.includes(keyword)) {
            results.push({
              book,
              chapter,
              verse,
              text: verseText,
            });
          }
        }
      }
    }

    res.json(results);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error al buscar por palabra clave", error: err });
  }
};

// Obtener todos los versículos de un capítulo
export const getVersesByChapter = async (req, res) => {
  const { book, chapter } = req.params;

  try {
    const bible = await Bible.findOne();
    const chapterVerses = bible?.bible_data[book]?.[chapter];

    if (!chapterVerses) {
      return res.status(404).json({ error: "Capítulo no encontrado" });
    }

    res.json(chapterVerses);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Buscar por palabra clave
export const searchVerses = async (req, res) => {
  const keyword = req.query.keyword?.toLowerCase();

  if (!keyword)
    return res.status(400).json({ error: "Palabra clave requerida" });

  try {
    const bible = await Bible.findOne(); // Solo tienes un documento con toda la Biblia
    const results = [];

    for (const book in bible.bible_data) {
      for (const chapter in bible.bible_data[book]) {
        for (const verse in bible.bible_data[book][chapter]) {
          const text = bible.bible_data[book][chapter][verse];
          if (text.toLowerCase().includes(keyword)) {
            results.push({
              book,
              chapter,
              verse,
              text,
            });
          }
        }
      }
    }

    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Función para insertar los datos de la Biblia en la base de datos
// export const insertBible = async (req, res) => {
//   try {
//     // Leer el archivo JSON de forma síncrona
//     const bibleJson = JSON.parse(fs.readFileSync(path.resolve('lib', 'bible','RVR1960.json'), 'utf-8'));

//     // Crear un nuevo documento de la Biblia
//     const bible = new Bible({
//       bible_data: bibleJson,
//     });

//     // Guardar los datos en la base de datos
//     await bible.save();
//     res.status(200).json({ message: 'Biblia insertada correctamente' });
//   } catch (error) {
//     console.error('Error al insertar la Biblia:', error);
//     res.status(500).json({ message: 'Error al insertar la Biblia', error });
//   }
// };
