import { File, FileMusic } from "lucide-react";
import { getFileType } from "../../../utils/file";
import { useRef } from "react";
import useSendMessage from "../../../../hooks/useSendMessage";
import useConversation from "../../../../zustand/useConversation";

const AudioAttachment = () => {
  const { addFiles } = useSendMessage();
  const inputRef = useRef(null);

  const { setFiles } = useConversation();

  const imageHandler = (e) => {
    let selectedFiles = Array.from(e.target.files); // Convertimos a array

    // Filtramos archivos no soportados o demasiado grandes
    selectedFiles = selectedFiles.filter(
      (file) =>
        ["audio/wav", "audio/webm", "audio/mpeg", "audio/mp3"].includes(
          file.type
        ) && file.size <= 1024 * 1024 * 5
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
        className="bg-[#ff7a33b9] rounded-full p-2 cursor-pointer text-white"
        onClick={() => inputRef.current.click()}
      >
        <FileMusic size={32} />
      </button>
      <input
        type="file"
        hidden
        multiple
        ref={inputRef}
        accept="audio/wav, audio/webm, audio/mpeg, audio/mp3"
        onChange={imageHandler}
      />
    </div>
  );
};

export default AudioAttachment;
