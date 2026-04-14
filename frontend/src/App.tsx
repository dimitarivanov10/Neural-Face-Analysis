import React, { useState, useRef, useCallback } from "react";
import { CheckCircle2, XCircle, UserCheck, RefreshCw } from "lucide-react";
import Webcam from "react-webcam"; // New import

const initialStudents = [
  { id: 1, name: "Ivan Rossi", time: "10:02 AM", status: "Present" },
  { id: 2, name: "Elena Petrova", time: "-", status: "Absent" },
  { id: 3, name: "Marko Kovac", time: "10:15 AM", status: "Present" },
];

export default function App() {
  const [students] = useState(initialStudents);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  // THE SCAN FUNCTION
  const handleScan = useCallback(async () => {
    if (!webcamRef.current) return;

    setIsAnalyzing(true);

    // 1. Capture frame from webcam as Base64 string
    const imageSrc = webcamRef.current.getScreenshot();

    if (imageSrc) {
      try {
        // 2. Convert Base64 to Blob to send to Python
        const blob = await fetch(imageSrc).then((res) => res.blob());
        const formData = new FormData();
        formData.append("file", blob, "capture.jpg");

        // 3. Send to FastAPI
        const response = await fetch("http://localhost:8000/detect", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();
        console.log("Backend response:", data);
        alert(`Recognized: ${data.identity}`); // Quick feedback
      } catch (error) {
        console.error(
          "Backend connection failed. Is your venv running main.py?",
          error,
        );
      }
    }

    setIsAnalyzing(false);
  }, [webcamRef]);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-purple-500/30">
      <header className="pt-12 pb-8 text-center">
        <h1 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-500 via-yellow-500 via-green-500 via-blue-500 to-purple-500 animate-pulse">
            Neural Face Analysis
          </span>
        </h1>
        <p className="text-gray-500 mt-2 tracking-widest text-sm uppercase">
          Intelligent Systems v1.0
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-6 grid grid-cols-1 gap-12 pb-20">
        <section className="flex flex-col items-center justify-center">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-green-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 animate-rainbow-slow"></div>

            {/* REAL WEBCAM FEED REPLACES THE ICON */}
            <div className="relative w-full max-w-2xl aspect-video bg-black border border-white/10 rounded-xl overflow-hidden shadow-2xl">
              <Webcam
                audio={false}
                ref={webcamRef}
                screenshotFormat="image/jpeg"
                className="w-full h-full object-cover"
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

        {/* TABLE SECTION (Kept the same) */}
        <section className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
          {/* ... your table code remains here ... */}
          <div className="px-8 py-6 border-b border-white/10 bg-white/[0.02] flex justify-between items-center">
            <h2 className="text-xl font-bold flex items-center gap-3">
              Attendance List{" "}
              <span className="text-xs font-normal text-gray-500">
                2026 Academic Year
              </span>
            </h2>
            <div className="text-xs text-gray-400">
              Total: {students.length} Students
            </div>
          </div>
          <table className="w-full text-left">
            <thead>
              <tr className="text-gray-500 text-sm uppercase tracking-wider">
                <th className="px-8 py-4 font-medium text-xs md:text-sm">
                  Student Name
                </th>
                <th className="px-8 py-4 font-medium text-xs md:text-sm">
                  Check-in Time
                </th>
                <th className="px-8 py-4 font-medium text-xs md:text-sm">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-8 py-4 font-semibold group-hover:text-blue-400 transition-all">
                    {student.name}
                  </td>
                  <td className="px-8 py-4 text-gray-400 font-mono text-sm">
                    {student.time}
                  </td>
                  <td className="px-8 py-4">
                    {student.status === "Present" ? (
                      <span className="flex items-center gap-2 text-green-400 text-xs font-bold bg-green-400/10 px-3 py-1 rounded-full border border-green-400/20 w-fit">
                        <CheckCircle2 size={14} /> PRESENT
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-red-400 text-xs font-bold bg-red-400/10 px-3 py-1 rounded-full border border-red-400/20 w-fit">
                        <XCircle size={14} /> ABSENT
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  );
}
