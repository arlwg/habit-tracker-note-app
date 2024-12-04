'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';

interface SidebarProps {
  currentView: 'habits' | 'notes';
  onViewChange: (view: 'habits' | 'notes') => void;
}

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <motion.div
      initial={{ width: 240 }}
      animate={{ width: isExpanded ? 240 : 64 }}
      className="h-screen bg-[#1a1a1a] fixed left-0 top-0 flex flex-col p-4 border-r border-[#2a2a2a]"
    >
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsExpanded(!isExpanded)}
        className="absolute right-[-12px] top-8 w-6 h-6 bg-[#2a2a2a] rounded-full flex items-center justify-center"
      >
        {isExpanded ? '←' : '→'}
      </motion.button>

      <div className="space-y-4">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onViewChange('habits')}
          className={`w-full p-3 rounded-lg flex items-center space-x-3 ${
            currentView === 'habits' ? 'bg-blue-500' : 'hover:bg-[#2a2a2a]'
          }`}
        >
          <span className="text-xl">📊</span>
          {isExpanded && <span>Habits</span>}
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onViewChange('notes')}
          className={`w-full p-3 rounded-lg flex items-center space-x-3 ${
            currentView === 'notes' ? 'bg-blue-500' : 'hover:bg-[#2a2a2a]'
          }`}
        >
          <span className="text-xl">📝</span>
          {isExpanded && <span>Notes</span>}
        </motion.button>
      </div>
    </motion.div>
  );
} 