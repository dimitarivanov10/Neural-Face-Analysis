import { Camera, UserCheck } from "lucide-react";

export function CameraSectionView() {
  return (
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
  );
}
