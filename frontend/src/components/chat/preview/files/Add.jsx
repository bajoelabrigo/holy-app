import { Camera, X } from "lucide-react";
import { useCallback, useRef } from "react";
import { getFileType } from "../../../../utils/file";
import useSendMessage from "../../../../../hooks/useSendMessage";
import useConversation from "../../../../../zustand/useConversation";

const Add = () => {
  const { addFiles } = useSendMessage();
  const inputRef = useRef(null);

  const { setFiles } = useConversation();

  const imageHandler = useCallback((e) => {
    let selectedFiles = Array.from(e.target.files); // Convertimos a array

    const ALLOWED_TYPES = new Set([
      "image/png",
      "image/jpeg",
      "image/gif",
      "image/webp",
      "image/jpg",
      "video/mp4",
      "video/mpeg",
      "video/webm",
      "application/pdf",
      "text/plain",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "application/vnd.rar",
      "application/zip",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "audio/wav",
      "audio/webm",
      "audio/mpeg",
      "audio/mp3",
    ]);

    // Filtramos archivos no soportados o demasiado grandes
    selectedFiles = selectedFiles.filter(
      (file) => ALLOWED_TYPES.has(file.type) && file.size <= 10 * 1024 * 1024
    );

    if (selectedFiles.length === 0) {
      return; // No hay archivos válidos para agregar
    }

    const processedFiles = [];

    selectedFiles.forEach((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        processedFiles.push({
          file: file,
          fileData: e.target.result,
          type: getFileType(file.type),
        });

        // Cuando se haya procesado el último archivo, lo agregamos
        if (processedFiles.length === selectedFiles.length) {
          setFiles((prev) => [...prev, ...processedFiles]);
          addFiles(processedFiles); // ✅ Pasamos un ARRAY, no un objeto individual
        }
      };
    });
  }, []);

  return (
    <>
      <div
        className="w-14 h-14 mt-2 border dark:border-white rounded-md flex items-center justify-center cursor-pointer"
        onClick={() => inputRef.current.click()}
      >
        <span className="rotate-45">
          <X />
        </span>
      </div>
      <input
        type="file"
        hidden
        multiple
        ref={inputRef}
        accept="application/*,text/plain,image/png, image/jpg, image/jpeg, image/gif, image/webp, video/mp4, video/mpeg, video/webm"
        onChange={imageHandler}
      />
    </>
  );
};

export default Add;
