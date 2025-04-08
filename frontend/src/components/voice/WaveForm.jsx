import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Pause, Play } from "@phosphor-icons/react";
import { useSelector } from "react-redux";

export default function Waveform({url}) {
  
  const waveformRef = useRef(null);
  const [wavesurfer, setWavesurfer] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState("0:00");
  const [duration, setDuration] = useState("0:00");

  useEffect(() => {
    if (waveformRef.current) {
      const ws = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#0099DD",
        progressColor: "#F23030",
        url: url,
        renderFunction: (channels, ctx) => {
          const { width, height } = ctx.canvas;
          const scale = channels[0].length / width;
          const step = 6;

          ctx.translate(0, height / 2);
          ctx.strokeStyle = ctx.fillStyle;
          ctx.beginPath();

          for (let i = 0; i < width; i += step * 2) {
            const index = Math.floor(i * scale);
            const value = Math.abs(channels[0][index]);
            let x = i;
            let y = value * height;

            ctx.moveTo(x, 0);
            ctx.lineTo(x, y);
            ctx.arc(x + step / 2, y, step / 2, Math.PI, 0, true);
            ctx.lineTo(x + step, 0);

            x = x + step;
            y = -y;
            ctx.moveTo(x, 0);
            ctx.lineTo(x, y);
            ctx.arc(x + step / 2, y, step / 2, Math.PI, 0, false);
            ctx.lineTo(x + step, 0);
          }

          ctx.stroke();
          ctx.closePath();
        },
      });
      ws.on("ready", () => {
        const totalDuration = ws.getDuration();
        setDuration(formatTime(totalDuration));
      });

      ws.on("audioprocess", () => {
        const currentTime = ws.getCurrentTime();
        setCurrentTime(formatTime(currentTime));
      });

      ws.on("finish", () => {
        setIsPlaying(false);
        setCurrentTime(formatTime(0));
      });

      setWavesurfer(ws);

      return () => {
        ws.destroy();
      };
    }
  }, []);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  const handlePlayPause = () => {
    if (wavesurfer) {
      if (isPlaying) {
        wavesurfer.pause();
      } else {
        wavesurfer.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div
      className={`flex flex-row items-center  rounded-md ${"bg-transparent"}`}
    >
      <button
        onClick={handlePlayPause}
        className=" p-2 rounded-full h-18 w-18 flex items-center justify-center shadow-2"
      >
        {isPlaying ? (
          <Pause size={30} weight="bold" />
        ) : (
          <Play size={30} weight="bold" />
        )}
      </button>

      <div className="grow flex flex-col space-y-1">
        <div
          className="min-w-[500px] max-w-[800px] !z-0"
          ref={waveformRef}
          style={{ overflow: "hidden" }}
        ></div>
        <div className="text-sm">
          {currentTime} / {duration}
        </div>
      </div>
    </div>
  );
}
