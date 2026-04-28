import React, { useRef, useState, useCallback, useEffect } from "react";
import Webcam from "react-webcam";
import { RefreshCw, ShieldCheck } from "lucide-react";

interface CameraProps {
  onRecognized: (name: string) => void;
}

export function CameraSectionView({ onRecognized }: CameraProps) {
  const webcamRef = useRef<Webcam>(null);

  const [detection, setDetection] = useState<{
    identity: string;
    box: number[] | null;
    confidence: number;
  }>({
    identity: "Scanning...",
    box: null,
    confidence: 0,
  });

  const handleScan = useCallback(async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (imageSrc) {
      try {
        const blob = await fetch(imageSrc).then((res) => res.blob());
        const formData = new FormData();
        formData.append("file", blob, "capture.jpg");

        const response = await fetch("http://localhost:8000/detect", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        setDetection({
          identity: data.identity,
          box: data.box,
          confidence: data.confidence || 0,
        });

        if (data.confidence > 0.85 && data.identity !== "Stranger") {
          onRecognized(data.identity);
        }
      } catch (error) {
        console.error("Connection failed:", error);
      }
    }
  }, [webcamRef, onRecognized]);

  useEffect(() => {
    const interval = setInterval(() => {
      handleScan();
    }, 600);
    return () => clearInterval(interval);
  }, [handleScan]);

  return (
    <section className="flex flex-col items-center justify-center">
      <div className="relative group w-full max-w-2xl">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-green-500 to-purple-600 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-1000"></div>

        <div className="relative w-full aspect-video bg-black border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-full object-cover scale-x-[-1]" // MIRRORED
            videoConstraints={{ facingMode: "user" }}
          />

          {/* --- FACE BOX OVERLAY --- */}
          {detection.box && (
            <div
              className="absolute border-2 border-green-500 shadow-[0_0_15px_rgba(34,197,94,0.5)] transition-all duration-300"
              style={{
                // MATH TO FLIP BOX: (100% width) - (x position) - (box width)
                // This accounts for the scale-x-[-1] mirroring
                left: `calc(100% - ${detection.box[0]}px - ${detection.box[2]}px)`,
                top: `${detection.box[1]}px`,
                width: `${detection.box[2]}px`,
                height: `${detection.box[3]}px`,
              }}
            >
              {/* Identity Label */}
              <div className="absolute -top-8 left-0 flex items-center gap-2 bg-green-500 text-white text-[10px] font-black px-2 py-1 uppercase tracking-tighter rounded-t-md">
                <ShieldCheck size={12} />
                {detection.identity} {Math.round(detection.confidence * 100)}%
              </div>
            </div>
          )}

          {/* Status Badge */}
          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-black/50 backdrop-blur-md border border-white/10 rounded-full">
            <div
              className={`w-2 h-2 rounded-full ${detection.identity !== "Stranger" && detection.identity !== "No face detected" ? "bg-green-500 animate-pulse" : "bg-red-500"}`}
            ></div>
            <span className="text-[10px] font-bold text-white tracking-wider uppercase">
              AI System: {detection.identity}
            </span>
          </div>
        </div>
      </div>

      {/* Manual Refresh button in case it hangs */}
      <button
        onClick={() =>
          setDetection({ identity: "Resetting...", box: null, confidence: 0 })
        }
        className="mt-6 text-gray-500 hover:text-white flex items-center gap-2 text-xs uppercase tracking-widest transition-colors"
      >
        <RefreshCw size={14} /> Clear Cache
      </button>
    </section>
  );
}
