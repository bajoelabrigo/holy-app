import { Camera, Clapperboard } from "lucide-react";
import { getFileType } from "../../../utils/file";
import { useRef } from "react";
import useSendMessage from "../../../../hooks/useSendMessage";
import useConversation from "../../../../zustand/useConversation";

const VideoAttachment = () => {
  const { addFiles } = useSendMessage();
  const inputRef = useRef(null);

  const { setFiles } = useConversation();

  const imageHandler = (e) => {
    let selectedFiles = Array.from(e.target.files); // Convertimos a array

    // Filtramos archivos no soportados o demasiado grandes
    selectedFiles = selectedFiles.filter(
      (file) =>
        [
          "image/png",
          "image/jpeg",
          "image/gif",
          "image/webp",
          "image/jpg",
          "video/mp4",
          "video/mpeg",
          "video/webm",
        ].includes(file.type) && file.size <= 1024 * 1024 * 10
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
  };

  return (
    <div>
      <button
        type="button"
        className="bg-[#D3396D] rounded-full p-2 cursor-pointer text-white"
        onClick={() => inputRef.current.click()}
      >
        <Clapperboard size={32} className="text-white" />
      </button>
      <input
        type="file"
        hidden
        multiple
        ref={inputRef}
        accept="image/png, image/jpg, image/jpeg, image/gif, image/webp, video/mp4, video/mpeg, video/webm"
        onChange={imageHandler}
      />
    </div>
  );
};

export default VideoAttachment;
