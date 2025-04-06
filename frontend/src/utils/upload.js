// const cloud_name = "drojpkloa"
// const cloud_secret = "ga0qcefb"
import axios from "axios";

const cloud_name = `${import.meta.env.VITE_CLOUD_NAME}`;
const cloud_secret = `${import.meta.env.VITE_UPLOAD_PRESET}`;

const detectFileType = (file) => {
  const name = file.name.toLowerCase();

  if (name.match(/\.(jpg|jpeg|png|gif|webp|svg)$/)) return "IMAGE";
  if (name.match(/\.(mp4|mov|webm|mkv|avi)$/)) return "VIDEO";
  if (name.match(/\.(mp3|wav|ogg|m4a)$/)) return "AUDIO";

  return "OTHER"; // PDF, DOCX, ZIP, PPTX, etc.
};

export const uploadFiles = async (files) => {
  let formData = new FormData();
  formData.append("upload_preset", cloud_secret);
  let uploaded = [];
  for (const f of files) {
    const { file, type } = f;
    formData.append("file", file);
    let res = await uploadToCloudinary(formData);
    console.log(res)
    uploaded.push({
      file: res,
      type: type,
    });
  }
  return uploaded;
};

const uploadToCloudinary = async (formData, type) => {
  let resourceType = "raw"; // "raw" es el tipo adecuado para archivos como PDFs

  if (type === "IMAGE") resourceType = "image";
  else if (type === "VIDEO") resourceType = "video";

  try {
    const { data } = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloud_name}/${resourceType}/upload`,
      formData
    );
    return data;
  } catch (err) {
    console.error("Cloudinary upload error:", err);
    return null;
  }
};
