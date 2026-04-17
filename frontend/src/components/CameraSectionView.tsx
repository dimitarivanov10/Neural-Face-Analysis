import React, { useRef, useState, useCallback } from "react";
import Webcam from "react-webcam"; // This was missing
import { UserCheck, RefreshCw } from "lucide-react";

export function CameraSectionView() {
  const webcamRef = useRef<Webcam>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleScan = useCallback(async () => {
    if (!webcamRef.current) return;
    setIsAnalyzing(true);

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
        alert(`Recognized: ${data.identity}`);
      } catch (error) {
        console.error("Connection failed:", error);
      }
    }
    setIsAnalyzing(false);
  }, [webcamRef]);

  return (
    <section className="flex flex-col items-center justify-center">
      <div className="relative group w-full max-w-2xl">
        {" "}
        {/* Added width constraint here */}
        <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-green-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 animate-rainbow-slow"></div>
        <div className="relative w-full aspect-video bg-black border border-white/10 rounded-xl overflow-hidden shadow-2xl">
          {/* THE ACTUAL WEBCAM (Replaces the <Camera /> icon) */}
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-full object-cover scale-x-[-1]"
            videoConstraints={{ facingMode: "user" }}
          />

          <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-500/50 rounded-full">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
            <span className="text-[10px] font-bold text-red-500 tracking-wider uppercase">
              Live Feed
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleScan}
        disabled={isAnalyzing}
        className="mt-8 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 disabled:bg-gray-500 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
      >
        {isAnalyzing ? (
          <RefreshCw className="animate-spin" size={20} />
        ) : (
          <UserCheck size={20} />
        )}
        {isAnalyzing ? "Processing AI..." : "Scan Identity"}
      </button>
    </section>
  );
}
