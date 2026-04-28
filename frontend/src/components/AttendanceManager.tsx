import React, { useState } from "react";
import { CameraSectionView } from "./CameraSectionView.tsx";
import { TableSectionView } from "./TableSectionView.tsx";

export function AttendanceManager() {
  const [attendance, setAttendance] = useState<
    { id: number; name: string; time: string; status: string }[]
  >([]);

  const handleNewDetection = (name: string) => {
    if (
      name === "Stranger" ||
      name === "No face detected" ||
      name === "Scanning..."
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

  return (
    <>
      <CameraSectionView onRecognized={handleNewDetection} />
      <TableSectionView students={attendance} />
    </>
  );
}
