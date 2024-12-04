export default function Header() {
  return (
    <header className="flex justify-between items-center p-4 bg-[#1a1a1a] rounded-lg">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-blue-500 rounded"></div>
        <span className="text-xl">habits</span>
      </div>
      <button className="text-gray-400 hover:text-white transition-colors">
        Sync
      </button>
    </header>
  );
} 