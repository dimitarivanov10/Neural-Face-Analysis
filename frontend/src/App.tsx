import { HeaderView } from "./components/HeaderView.tsx";
import { AttendanceManager } from "./components/AttendanceManager.tsx";
import { RegisterView } from "./components/RegisterView.tsx";

export default function App() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white font-sans">
      <HeaderView />

      <main className="max-w-6xl mx-auto px-6 grid grid-cols-1 gap-12 pb-20">
        <AttendanceManager />

        <RegisterView />
      </main>
    </div>
  );
}
