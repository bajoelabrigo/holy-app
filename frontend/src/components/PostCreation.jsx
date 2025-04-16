import React, { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";
import { File, Image, Loader } from "lucide-react";
import { axiosInstance } from "../lib/axios";

const cloud_name = `${import.meta.env.VITE_CLOUD_NAME}`;
const cloud_secret = `${import.meta.env.VITE_UPLOAD_PRESET}`;

const PostCreation = ({ user }) => {
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const queryClient = useQueryClient();

  const { mutate: createPostMutation, isPending } = useMutation({
    mutationFn: async (postData) => {
      const res = await axiosInstance.post("/posts/create", postData, {
        headers: { "Content-Type": "application/json" },
      });
      return res.data;
    },
    onSuccess: () => {
      resetForm();
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      toast.success("Post created successfully");
    },
    onError: (err) => {
      toast.error(err.response?.data?.message || "Failed to create post");
    },
  });

  const uploadToCloudinary = async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", cloud_secret);

    // Detectar tipo para elegir el endpoint adecuado
    let resourceType = "raw"; // por defecto
    if (file.type.startsWith("image/")) resourceType = "image";
    if (file.type.startsWith("video/")) resourceType = "video";

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloud_name}/${resourceType}/upload`;

    const res = await fetch(uploadUrl, {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    return data.secure_url;
  };

  const handlePostCreation = async () => {
    try {
      const postData = { content };

      if (image) {
        const fileUrl = await uploadToCloudinary(image);
        postData.image = fileUrl; // siempre mandamos como image
      }

      createPostMutation(postData);
    } catch (error) {
      console.error("Error in handlePostCreation:", error);
    }
  };

  const resetForm = () => {
    setContent("");
    setImage(null);
    setImagePreview(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 20 * 1024 * 1024) {
      toast.error("File size should be less than 10.");
      return;
    }

    setImage(file);

    if (file.type.startsWith("image/")) {
      readFileAsDataURL(file).then(setImagePreview);
    } else {
      setImagePreview(null);
    }
  };

  const readFileAsDataURL = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleRemoveFile = () => {
    setImage(null);
    setImagePreview(null);
  };

  const renderFilePreview = () => {
    if (!image) return null;

    if (image.type.startsWith("image/") && imagePreview) {
      return (
        <div className="mt-4 relative">
          <img
            src={imagePreview}
            alt="Preview"
            className="rounded-lg max-h-64"
          />
          <button
            onClick={handleRemoveFile}
            className="absolute top-2 right-2 bg-red-500 text-white text-xl px-2 py-1 rounded"
          >
            Remove
          </button>
        </div>
      );
    }

    let icon = "";

    // Verificar el tipo de archivo y asignar un ícono adecuado
    if (image.type === "application/pdf") {
      icon = "/images/file/PDF.png";
    } else if (
      image.type === "application/msword" ||
      image.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      icon = "/images/file/DOCX.png";
    } else if (image.type === "video/mp4" || image.type === "video/x-msvideo") {
      icon = "/images/file/video.png"; // Asignar un ícono para videos
    } else if (image.type === "text/plain") {
      icon = "/images/file/TXT.png"; // Asignar un ícono para archivos de texto
    } else if (
      image.type ===
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    ) {
      icon = "/images/file/sobresalir.png"; // Asignar un ícono para archivos Excel (XLSX)
    } else if (
      image.type === "application/zip" ||
      image.type === "application/x-zip-compressed"
    ) {
      icon = "/images/file/carpeta-zip"; // Asignar un ícono para archivos ZIP
    } else {
      icon = "/images/file/DEFAULT.png"; // Un ícono por defecto para otros tipos de archivos
    }

    return (
      <div className="mt-4 flex items-center space-x-2  p-3 rounded-md">
        <img src={icon} alt="File" className="w-8" />
        <span className="truncate max-w-[80%] text-info">Descargar</span>
        <span className="truncate max-w-[80%]">{image.name}</span>
        <button
          onClick={handleRemoveFile}
          className="bg-red-500 text-white text-xs px-2 py-1 rounded ml-auto"
        >
          Remove
        </button>
      </div>
    );
  };

  return (
    <div className="bg-base-100 text-base-content rounded-lg shadow mb-4 p-4">
      <div className="flex space-x-3">
        <img
          src={user?.profilePicture || "/avatar.png"}
          alt={user?.name}
          className="size-12 rounded-full object-cover"
        />
        <textarea
          placeholder="What's on your mind?"
          className="w-full p-3 rounded-lg bg-base-100 hover:bg-base-200 focus:bg-base-200 focus:outline-none resize-none transition-colors duration-200 min-h-[100px]"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />
      </div>

      {renderFilePreview()}

      <div className="flex justify-between items-center mt-4">
        <label className="flex items-center text-info hover:text-info-dark transition-colors duration-200 cursor-pointer">
          <File size={20} className="mr-2" />
          <span>Document, Audio, Video</span>
          <input
            type="file"
            accept=".png,.jpg,.jpeg,.gif,.webp,.pdf,.doc,.docx,.txt,.mp4, /video/mpeg,.webm,.wav,.webm,audio/mpeg,.mp3"
            className="hidden"
            onChange={handleFileChange}
          />
        </label>

        <button
          className="bg-primary text-white rounded-lg px-4 py-2 hover:bg-primary-dark transition-colors duration-200"
          onClick={handlePostCreation}
          disabled={isPending}
        >
          {isPending ? <Loader className="size-5 animate-spin" /> : "Share"}
        </button>
      </div>
    </div>
  );
};

export default PostCreation;
