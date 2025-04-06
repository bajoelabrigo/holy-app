import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "../uploads"); // asegúrate de que esta carpeta exista
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  // Puedes permitir todo, o hacer validaciones si quieres
  cb(null, true); // acepta todos los archivos
};

export const upload = multer({ storage, fileFilter });
