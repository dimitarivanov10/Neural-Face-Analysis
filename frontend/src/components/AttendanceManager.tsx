import React, { useState } from "react";
import { CameraSectionView } from "./CameraSectionView.tsx";
import { TableSectionView } from "./TableSectionView.tsx";
import { Trash2, RotateCcw } from "lucide-react";

export function AttendanceManager() {
  const [attendance, setAttendance] = useState<
    { id: number; name: string; time: string; status: string }[]
  >([]);

  const handleNewDetection = (name: string) => {
    if (
      name === "Stranger" ||
      name === "No face detected" ||
      name === "Scanning..." ||
      name === "Error"
    )
      return;

    setAttendance((prev) => {
      const isAlreadyAdded = prev.some(
        (record) =>
          record.name.toLowerCase() === name.replace("_", " ").toLowerCase(),
      );

      if (isAlreadyAdded) return prev;

      return [
        {
          id: Date.now(),
          name: name.replace("_", " "),
          time: new Date().toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit",
          }),
          status: "Present",
        },
        ...prev,
      ];
    });
  };

  const handleResetSystem = async () => {
    const confirmReset = window.confirm(
      "Are you sure? This will wipe the AI memory (pickle file). You will need to re-enroll faces to recognize them again.",
    );

    if (!confirmReset) return;

    try {
      const response = await fetch("http://localhost:8000/reset-database", {
        method: "POST",
      });

      const data = await response.json();

      if (data.status === "success") {
        // Clear the frontend table as well
        setAttendance([]);
        alert("System memory wiped successfully.");
      } else {
        alert("Error: " + data.message);
      }
    } catch (error) {
      console.error("Failed to connect to backend:", error);
      alert("Could not connect to the server to reset.");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      {/* 1. Control Bar */}
      <div className="flex justify-between items-center bg-white/5 p-4 rounded-xl border border-white/10">
        <div>
          <h3 className="text-sm font-bold text-gray-400 uppercase tracking-widest">
            System Controls
          </h3>
        </div>
        <div className="flex gap-4">
          {/* Reset Button */}
          <button
            onClick={handleResetSystem}
            className="flex items-center gap-2 px-4 py-2 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 rounded-lg text-xs font-bold transition-all"
          >
            <Trash2 size={14} /> WIPE AI MEMORY
          </button>

          {/* Refresh Table Button */}
          <button
            onClick={() => setAttendance([])}
            className="flex items-center gap-2 px-4 py-2 bg-blue-500/10 hover:bg-blue-500/20 text-blue-500 border border-blue-500/20 rounded-lg text-xs font-bold transition-all"
          >
            <RotateCcw size={14} /> CLEAR TABLE
          </button>
        </div>
      </div>

      {/* 2. Camera Section */}
      <CameraSectionView onRecognized={handleNewDetection} />

      {/* 3. Table Section */}
      <TableSectionView students={attendance} />
    </div>
  );
}
