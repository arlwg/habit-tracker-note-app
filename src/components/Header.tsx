'use client';

import { motion } from 'framer-motion';
import useHabitStore from '@/store/habitStore';

export default function Header() {
  const syncData = useHabitStore((state) => state.syncData);

  return (
    <header className="flex justify-between items-center p-4 bg-[#1a1a1a] rounded-lg">
      <div className="flex items-center space-x-2">
        <div className="w-6 h-6 bg-blue-500 rounded"></div>
        <span className="text-xl">habits</span>
      </div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={syncData}
        className="text-gray-400 hover:text-white transition-colors"
      >
        Sync
      </motion.button>
    </header>
  );
} 