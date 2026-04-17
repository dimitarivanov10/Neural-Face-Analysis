import React, { useState, useRef } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

import { HeaderView } from "./components/HeaderView.tsx";
import { CameraSectionView } from "./components/CameraSectionView.tsx";

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
      {/* 1. BIG TITLE SECTION */}
      <HeaderView />

      <main className="max-w-6xl mx-auto px-6 grid grid-cols-1 gap-12 pb-20">
        {/* 2. CAMERA FEED SECTION (CENTERED) */}
        <CameraSectionView />
        {/* 3. INTERACTIVE ATTENDANCE TABLE */}
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
