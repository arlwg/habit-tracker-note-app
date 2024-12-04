'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useHabitStore from '@/store/habitStore';
import { Habit, HabitStore } from '@/types/habit';

const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getDatesForGrid() {
  const dates: string[] = [];
  const today = new Date();
  for (let i = 0; i < 9 * 12; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.unshift(date.toISOString().split('T')[0]);
  }
  return dates;
}

export default function HabitGrid({ habit }: { habit: Habit }) {
  const toggleCompletion = useHabitStore((state: HabitStore) => state.toggleCompletion);
  const dates = getDatesForGrid();
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-[#1a1a1a] p-4 rounded-lg"
    >
      <motion.div
        layout
        className="flex items-center space-x-2 mb-3"
      >
        <motion.span
          whileHover={{ scale: 1.2 }}
          className="text-xl"
          style={{ color: habit.color }}
        >
          ●
        </motion.span>
        <motion.div layout className="flex-1">{habit.name}</motion.div>
        <motion.div
          layout
          className="bg-[#2a2a2a] px-2 py-0.5 rounded-full text-sm"
        >
          {habit.streak} DAY STREAK
        </motion.div>
      </motion.div>
      
      <div className="grid grid-cols-9 gap-0.5">
        {months.map((month) => (
          <div key={month} className="text-gray-400 text-xs mb-0.5">
            {month}
          </div>
        ))}
        
        {dates.map((date) => {
          const isCompleted = habit.completions[date];
          return (
            <motion.button
              key={date}
              whileHover={{ scale: 1.2, zIndex: 10 }}
              whileTap={{ scale: 0.9 }}
              onHoverStart={() => setHoveredDate(date)}
              onHoverEnd={() => setHoveredDate(null)}
              onClick={() => toggleCompletion(habit.id, date)}
              className="relative"
            >
              <motion.div
                className={`w-full pt-[100%] rounded-sm transition-colors ${
                  isCompleted ? 'bg-current' : 'bg-[#2a2a2a] hover:bg-[#3a3a3a]'
                }`}
                style={{ color: habit.color }}
                animate={{
                  scale: isCompleted ? [1, 1.2, 1] : 1,
                  transition: { duration: 0.3 }
                }}
              />
              <AnimatePresence>
                {hoveredDate === date && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-[#2a2a2a] rounded text-xs whitespace-nowrap z-20"
                  >
                    {new Date(date).toLocaleDateString()}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
} 