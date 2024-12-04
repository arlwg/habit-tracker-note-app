import HabitGrid from '@/components/HabitGrid';
import Header from '@/components/Header';

export default function Home() {
  return (
    <main className="min-h-screen bg-[#121212] text-white p-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Header />
        <h1 className="text-6xl font-bold text-center">habits</h1>
        <p className="text-gray-400 text-center text-xl">Track your habits every day</p>
        <HabitGrid />
        <button className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] p-4 rounded-lg flex items-center justify-center space-x-2 transition-colors">
          <span className="text-2xl">+</span>
          <span className="text-xl">Create</span>
        </button>
      </div>
    </main>
  );
} 