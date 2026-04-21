import React, { useState, useRef } from "react";
import Webcam from "react-webcam";
// Added Upload here
import { Camera, Trash2, UserPlus, Upload } from "lucide-react";

export function RegisterView() {
  const [capturedImages, setCapturedImages] = useState<string[]>([]);
  const [studentName, setStudentName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  // 1. THE MISSING FUNCTION
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    // Convert to array and only take what we need to reach 10
    const filesArray = Array.from(files).slice(0, 10 - capturedImages.length);

    filesArray.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImages((prev) => {
          // Check again inside the loop to ensure we don't exceed 10 due to rapid uploads
          if (prev.length >= 10) return prev;
          return [...prev, reader.result as string];
        });
      };
      reader.readAsDataURL(file);
    });
  };

  const captureFrame = () => {
    if (capturedImages.length >= 10) return;
    const imageSrc = webcamRef.current?.getScreenshot();
    if (imageSrc) {
      setCapturedImages((prev) => [...prev, imageSrc]);
    }
  };

  const submitRegistration = async () => {
    if (capturedImages.length < 10 || !studentName) {
      alert("Please enter a name and capture 10 photos.");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("name", studentName);

    try {
      for (let i = 0; i < capturedImages.length; i++) {
        const response = await fetch(capturedImages[i]);
        const blob = await response.blob();
        formData.append("images", blob, `face_${i}.jpg`);
      }

      const res = await fetch("http://localhost:8000/register", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Registration Successful!");
        setCapturedImages([]);
        setStudentName("");
      }
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col items-center gap-8 py-10">
      {/* ... (Keep your existing JSX) ... */}
      <div className="w-full max-w-md">
        <label className="block text-xs uppercase tracking-widest text-gray-500 mb-2">
          Student Identity
        </label>
        <input
          type="text"
          value={studentName}
          onChange={(e) => setStudentName(e.target.value)}
          placeholder="Enter full name..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-blue-500 transition-colors"
        />
      </div>

      <div className="relative group w-full max-w-xl">
        <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl blur opacity-20 animate-pulse"></div>
        <div className="relative aspect-video bg-black rounded-xl overflow-hidden border border-white/10 shadow-2xl">
          <Webcam
            audio={false}
            ref={webcamRef}
            screenshotFormat="image/jpeg"
            className="w-full h-full object-cover scale-x-[-1]"
          />
          <div className="absolute bottom-4 left-4 right-4 bg-black/60 backdrop-blur-md p-2 rounded-lg border border-white/5">
            <div className="flex justify-between text-[10px] uppercase mb-1">
              <span>Biometric Capture</span>
              <span>{capturedImages.length} / 10</span>
            </div>
            <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                style={{ width: `${(capturedImages.length / 10) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-4 items-center">
        <button
          onClick={captureFrame}
          disabled={capturedImages.length >= 10}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-bold rounded-full transition-all"
        >
          <Camera size={20} />
          Capture
        </button>

        <label
          className={`flex items-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full cursor-pointer transition-all ${capturedImages.length >= 10 ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          <Upload size={20} />
          Upload Files
          <input
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            disabled={capturedImages.length >= 10}
            onChange={handleFileUpload}
          />
        </label>

        <button
          onClick={() => setCapturedImages([])}
          className="p-3 bg-white/5 hover:bg-red-500/20 text-gray-400 hover:text-red-500 rounded-full border border-white/10 transition-all"
        >
          <Trash2 size={20} />
        </button>
      </div>

      <div className="grid grid-cols-5 gap-2 w-full max-w-2xl">
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="aspect-square bg-white/5 border border-dashed border-white/10 rounded-lg overflow-hidden flex items-center justify-center"
          >
            {capturedImages[i] ? (
              <img
                src={capturedImages[i]}
                className="w-full h-full object-cover"
                alt={`capture-${i}`}
              />
            ) : (
              <span className="text-gray-700 text-xs">{i + 1}</span>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={submitRegistration}
        disabled={capturedImages.length < 10 || !studentName || isUploading}
        className="w-full max-w-md mt-4 py-4 bg-gradient-to-r from-green-500 to-emerald-600 disabled:from-gray-700 disabled:to-gray-800 text-white font-black uppercase tracking-widest rounded-xl shadow-lg hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-3"
      >
        {isUploading ? (
          "Processing Vectors..."
        ) : (
          <>
            <UserPlus size={20} /> Register Student
          </>
        )}
      </button>
    </div>
  );
}
