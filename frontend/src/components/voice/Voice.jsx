import { useEffect, useRef, useState } from "react";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import useSendMessage from "../../../hooks/useSendMessage";
import useConversation from "../../../zustand/useConversation";
import { getFileType } from "../../utils/file";

function Voice({ setShowAudioRecorder }) {
  const modalRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const [audioBlob, setAudioBlob] = useState(null); // State to store recorded audio blob

  const { setFiles, files } = useConversation();
  const { addFiles, clearFiles } = useSendMessage();

  useEffect(() => {
    const keyHandler = ({ keyCode }) => {
      if (!files || keyCode !== 27) return;

      clearFiles(false);
    };

    document.addEventListener("keydown", keyHandler);

    return () => document.removeEventListener("keydown", keyHandler);
  });

  const recorderControls = useAudioRecorder(
    {
      noiseSuppression: true,
      echoCancellation: true,
    },
    (err) => console.log(err)
  ); // onNotAllowedOrNotFound

  const addAudioElement = (blob) => {
    setAudioBlob(blob); // Store blob in state for sending on button click

    const url = URL.createObjectURL(blob);

    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;

    const targetContainer = document.getElementById("audio-container");
    targetContainer.appendChild(audio);
  };

  const handleSend = async () => {
    if (!audioBlob) return;

    try {
      const file = new File([audioBlob], `recording-${Date.now()}.webm`, {
        type: "audio/webm",
      });

      const processed = {
        file,
        type: getFileType(file.type),
      };

      addFiles([processed]);

      // Si quieres mantener la lista también en Zustand, actualiza aquí si necesario:
      setFiles((prev) => [...prev, processed]);
    } catch (error) {
      console.error("Error uploading audio:", error);
    }
  };

  return (
    <div
      className={`fixed left-0 top-0 z-999999 flex h-full min-h-screen w-full items-center justify-center bg-black/70 px-4 py-5 ${
        files ? "block" : "hidden"
      }`}
    >
      <div
        ref={modalRef}
        className="md:px-16 w-full max-w-[500px] rounded-lg bg-white dark:bg-boxdark md:py-8 px-8 py-12"
      >
        <div className="flex flex-col space-y-8 items-center">
          <div
            id="audio-container"
            className="flex flex-col space-y-4 items-center"
          >
            <AudioRecorder
              showVisualizer={true}
              onRecordingComplete={(blob) => addAudioElement(blob)}
              recorderControls={recorderControls}
              downloadOnSavePress={false}
              downloadFileExtension="webm" // <= CAMBIA AQUÍ
            />
          </div>
          <div className="flex flex-row items-center space-x-4 w-full mt-8">
            <button
              disabled={!audioBlob}
              onClick={() => {
                if (!audioBlob) {
                  console.log("Please record voice before sending!");
                } else {
                  handleSend();
                }
              }}
              className={`w-full rounded-lg p-2 flex flex-row items-center justify-center  ${
                !audioBlob
                  ? "cursor-not-allowed bg-gray dark:bg-boxdark-2 text-blue-400"
                  : "bg-primary text-white hover:bg-opacity-90"
              }`}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-t-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div> // Tailwind spinner
              ) : (
                "Preview and Send"
              )}
            </button>
            <button
              disabled={isLoading}
              onClick={() => {
                setShowAudioRecorder((pre) => !pre);
              }}
              className="w-full border bg-transparent border-red-500 rounded-lg p-2 text-red-500"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Voice;
