import Waveform from "../../voice/WaveForm";

export default function FileImageVideo({ url, type }) {
  return (
    <div className="z-20">
      {type === "IMAGE" ? (
        <img src={url} alt="" className="cursor-pointer rounded-md" />
      ) : null}
      {type === "VIDEO" ? (
        <video src={url} controls className="cursor-pointer" />
      ) : null}
      {type === "AUDIO" ? (
        <Waveform url={url} className="cursor-pointer" />
      ) : null}
    </div>
  );
}
