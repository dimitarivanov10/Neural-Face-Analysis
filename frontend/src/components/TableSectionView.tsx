export function TableSectionView() {
  return (
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
  );
}
