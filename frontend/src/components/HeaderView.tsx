export function HeaderView() {
  return (
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
  );
}
