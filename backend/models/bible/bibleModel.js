import mongoose from "mongoose";

// Creamos un modelo simple que almacene el libro con sus capítulos y versículos como un objeto
const bibleSchema = new mongoose.Schema({
  bible_data: { type: Object, required: true },
});

const Bible = mongoose.model("Bible", bibleSchema);

export default Bible;
