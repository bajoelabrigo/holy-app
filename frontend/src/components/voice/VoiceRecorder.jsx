import { Microphone } from "@phosphor-icons/react";
import React from "react";
import Voice from "./Voice";

function VoiceRecorder({
  showAudioRecorder,
  setShowAudioRecorder,
  setShowPicker,
}) {
  return (
    <div className="relative">
      <button
        onClick={() => {
          setShowPicker(false);
          setShowAudioRecorder((pre) => !pre);
        }}
        type="button"
        className="absolute left-21 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-sky-500 focus:outline-none"
      >
        <Microphone size={24}/>
      </button>

      {showAudioRecorder ? <Voice setShowAudioRecorder={setShowAudioRecorder}/> : null}
    </div>
  );
}

export default VoiceRecorder;