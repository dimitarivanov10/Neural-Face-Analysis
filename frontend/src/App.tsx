import React, { useState } from "react";
import { Camera, CheckCircle2, XCircle, UserCheck } from "lucide-react";

import { HeaderView } from "./components/HeaderView.tsx";

// Mock Data for the Table
const initialStudents = [
  { id: 1, name: "Ivan Rossi", time: "10:02 AM", status: "Present" },
  { id: 2, name: "Elena Petrova", time: "-", status: "Absent" },
  { id: 3, name: "Marko Kovac", time: "10:15 AM", status: "Present" },
];

export default function App() {
  const [students] = useState(initialStudents);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-purple-500/30">
      {/* 1. BIG TITLE SECTION */}
      <HeaderView />

      <main className="max-w-6xl mx-auto px-6 grid grid-cols-1 gap-12 pb-20">
        {/* 2. CAMERA FEED SECTION (CENTERED) */}
        <section className="flex flex-col items-center justify-center">
          <div className="relative group">
            {/* RGB Animated Border Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-red-600 via-green-500 to-blue-600 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200 animate-rainbow-slow"></div>

            {/* The "Camera Box" */}
            <div className="relative w-full max-w-2xl aspect-video bg-black border border-white/10 rounded-xl overflow-hidden flex items-center justify-center shadow-2xl">
              <div className="absolute top-4 left-4 flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-500/50 rounded-full">
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
                <span className="text-[10px] font-bold text-red-500 tracking-wider uppercase">
                  Live Feed
                </span>
              </div>

              <Camera size={80} className="text-white/10 animate-pulse" />

              {/* Overlay for UI feedback (will show name when recognized) */}
              <div className="absolute bottom-0 w-full p-6 bg-gradient-to-t from-black/80 to-transparent">
                <p className="text-center text-gray-400 italic">
                  Position your face within the frame...
                </p>
              </div>
            </div>
          </div>

          <button className="mt-8 px-8 py-3 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
            <UserCheck size={20} />
            Scan Identity
          </button>
        </section>

        {/* 3. INTERACTIVE ATTENDANCE TABLE */}
        <section className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden backdrop-blur-sm">
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
                <th className="px-8 py-4 font-medium">Student Name</th>
                <th className="px-8 py-4 font-medium">Check-in Time</th>
                <th className="px-8 py-4 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {students.map((student) => (
                <tr
                  key={student.id}
                  className="hover:bg-white/[0.02] transition-colors group"
                >
                  <td className="px-8 py-4 font-semibold group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-purple-500 transition-all">
                    {student.name}
                  </td>
                  <td className="px-8 py-4 text-gray-400 font-mono text-sm">
                    {student.time}
                  </td>
                  <td className="px-8 py-4">
                    {student.status === "Present" ? (
                      <span className="flex items-center gap-2 text-green-400 text-sm font-bold bg-green-400/10 w-fit px-3 py-1 rounded-full border border-green-400/20">
                        <CheckCircle2 size={14} /> PRESENT
                      </span>
                    ) : (
                      <span className="flex items-center gap-2 text-red-400 text-sm font-bold bg-red-400/10 w-fit px-3 py-1 rounded-full border border-red-400/20">
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
