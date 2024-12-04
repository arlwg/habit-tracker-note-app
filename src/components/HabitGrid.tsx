'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useHabitStore from '@/store/habitStore';
import { Habit, HabitStore } from '@/types/habit';

function getDatesForGrid(startDate?: string) {
  const dates: string[] = [];
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let start;
  if (startDate) {
    start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
  } else {
    // Default to last 365 days if no start date
    start = new Date(today);
    start.setDate(start.getDate() - 364);
  }

  // Ensure we don't go past today
  const end = new Date(today);
  
  // Generate dates from start to end
  const current = new Date(start);
  while (current <= end) {
    dates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

export default function HabitGrid({ habit }: { habit: Habit }) {
  const toggleCompletion = useHabitStore((state: HabitStore) => state.toggleCompletion);
  const deleteHabit = useHabitStore((state: HabitStore) => state.deleteHabit);
  const dates = getDatesForGrid(habit.startDate);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  // Calculate number of columns needed (7 days per week)
  const numWeeks = Math.ceil(dates.length / 7);
  
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
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowDeleteConfirm(true)}
          className="text-gray-400 hover:text-red-500 transition-colors px-2"
        >
          ×
        </motion.button>
      </motion.div>
      
      <div 
        className="grid gap-[2px]" 
        style={{ 
          gridTemplateColumns: `repeat(${numWeeks}, 1fr)`,
          maxHeight: '120px',
          overflowY: 'hidden'
        }}
      >
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
              className="relative aspect-square"
            >
              <motion.div
                className={`w-full h-full rounded-[1px] transition-colors ${
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

      <AnimatePresence>
        {showDeleteConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
            onClick={(e) => e.target === e.currentTarget && setShowDeleteConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1a1a1a] p-6 rounded-lg max-w-sm w-full mx-4"
            >
              <h3 className="text-xl mb-4">Delete Habit</h3>
              <p className="text-gray-400 mb-6">Are you sure you want to delete "{habit.name}"? This action cannot be undone.</p>
              <div className="flex space-x-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] p-2 rounded transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    deleteHabit(habit.id);
                    setShowDeleteConfirm(false);
                  }}
                  className="flex-1 bg-red-500 hover:bg-red-600 p-2 rounded transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
} 