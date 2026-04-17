import React, { useState, useRef } from "react";
import { CheckCircle2, XCircle } from "lucide-react";

import { HeaderView } from "./components/HeaderView.tsx";
import { CameraSectionView } from "./components/CameraSectionView.tsx";
import { TableSectionView } from "./components/TableSectionView.tsx";
export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans selection:bg-purple-500/30">
      {/* 1. BIG TITLE SECTION */}
      <HeaderView />

      <main className="max-w-6xl mx-auto px-6 grid grid-cols-1 gap-12 pb-20">
        {/* 2. CAMERA FEED SECTION (CENTERED) */}
        <CameraSectionView />
        {/* 3. INTERACTIVE ATTENDANCE TABLE */}
        <TableSectionView />
      </main>
    </div>
  );
}
