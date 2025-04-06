import multer from 'multer';
import path from 'path';

// Configuración de almacenamiento de archivos con Multer
export const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, '../uploads'); // Aquí se guardarán los archivos
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Nombre único para cada archivo
  }
});

export const upload = multer({ storage });