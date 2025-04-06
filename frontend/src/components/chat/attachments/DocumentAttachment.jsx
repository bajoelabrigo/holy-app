import { File } from "lucide-react";
import { getFileType } from "../../../utils/file";
import { useRef } from "react";
import useSendMessage from "../../../../hooks/useSendMessage";
import useConversation from "../../../../zustand/useConversation";

const DocumentAttachment = () => {
  const { addFiles } = useSendMessage();
  const inputRef = useRef(null);

  const { setFiles } = useConversation();

  const imageHandler = (e) => {
    let selectedFiles = Array.from(e.target.files); // Convertimos a array

    // Filtramos archivos no soportados o demasiado grandes
    selectedFiles = selectedFiles.filter(
      (file) =>
        [
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
        ].includes(file.type) && file.size <= 1024 * 1024 * 5
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
        className="bg-[#38c03fb9] rounded-full p-2 cursor-pointer text-white"
        onClick={() => inputRef.current.click()}
      >
        <File size={32} />
      </button>
      <input
        type="file"
        hidden
        multiple
        ref={inputRef}
        accept="application/*,text/plain"
        onChange={imageHandler}
      />
    </div>
  );
};

export default DocumentAttachment;
