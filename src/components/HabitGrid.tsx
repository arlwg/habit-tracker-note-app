'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useHabitStore from '@/store/habitStore';
import { Habit, HabitStore } from '@/types/habit';

function getDatesForGrid(startDate?: string) {
  const dates: { date: string; dayOfWeek: number }[] = [];
  const today = new Date();
  today.setHours(23, 59, 59, 999); // Set to end of day to ensure today is included
  
  let start;
  if (startDate) {
    start = new Date(startDate);
    start.setHours(0, 0, 0, 0);
  } else {
    start = new Date(today);
    start.setDate(start.getDate() - 364);
  }

  const end = new Date(today);
  const current = new Date(start);
  while (current <= end) {
    dates.push({
      date: current.toISOString().split('T')[0],
      dayOfWeek: current.getDay()
    });
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

const getCompletionLevel = (completions: Record<string, boolean>, date: string): number => {
  const dateObj = new Date(date);
  let count = 0;
  
  if (completions[date]) count++;
  
  for (let i = 1; i <= 3; i++) {
    const prevDate = new Date(dateObj);
    prevDate.setDate(prevDate.getDate() - i);
    const prevDateStr = prevDate.toISOString().split('T')[0];
    if (completions[prevDateStr]) count++;
  }
  
  return Math.min(Math.floor(count * 1.5), 4);
};

const dayLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export default function HabitGrid({ habit }: { habit: Habit }) {
  const toggleCompletion = useHabitStore((state: HabitStore) => state.toggleCompletion);
  const deleteHabit = useHabitStore((state: HabitStore) => state.deleteHabit);
  const dates = getDatesForGrid(habit.startDate);
  const [hoveredDate, setHoveredDate] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStartDate, setDragStartDate] = useState<string | null>(null);
  const [dragDirection, setDragDirection] = useState<'forward' | 'backward' | null>(null);
  const [selectedDates, setSelectedDates] = useState<Set<string>>(new Set());

  const weeks = dates.reduce((acc, { date, dayOfWeek }) => {
    const weekIndex = Math.floor(dates.findIndex(d => d.date === date) / 7);
    if (!acc[weekIndex]) acc[weekIndex] = new Array(7).fill(null);
    acc[weekIndex][dayOfWeek] = date;
    return acc;
  }, [] as (string | null)[][]);

  const handleDragStart = (date: string) => {
    setIsDragging(true);
    setDragStartDate(date);
    setSelectedDates(new Set([date]));
    toggleCompletion(habit.id, date);
  };

  const handleDrag = (currentDate: string) => {
    if (!isDragging || !dragStartDate) return;

    const startTime = new Date(dragStartDate).getTime();
    const currentTime = new Date(currentDate).getTime();

    // Set drag direction only once when drag begins
    if (!dragDirection) {
      setDragDirection(currentTime > startTime ? 'forward' : 'backward');
      return;
    }

    // Only allow dragging in the initial direction
    if (dragDirection === 'forward' && currentTime < startTime) return;
    if (dragDirection === 'backward' && currentTime > startTime) return;

    const newSelectedDates = new Set<string>();
    const current = new Date(Math.min(startTime, currentTime));
    const end = new Date(Math.max(startTime, currentTime));

    while (current <= end) {
      const dateStr = current.toISOString().split('T')[0];
      newSelectedDates.add(dateStr);
      current.setDate(current.getDate() + 1);
    }

    // Only toggle dates that weren't previously selected
    newSelectedDates.forEach(date => {
      if (!selectedDates.has(date)) {
        toggleCompletion(habit.id, date);
      }
    });

    setSelectedDates(newSelectedDates);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
    setDragStartDate(null);
    setDragDirection(null);
    setSelectedDates(new Set());
  };

  return (
    <>
      <div className="w-full">
        {/* Days of week header */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayLabels.map((day) => (
            <div
              key={day}
              className="text-xs text-gray-400 font-medium text-center h-8 flex items-center justify-center"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {/* Empty cells for alignment */}
          {Array.from({ length: weeks[0].findIndex(date => date !== null) }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="w-[12px] h-[12px] rounded border border-[#2a2a2a] bg-[#1a1a1a] opacity-30"
            />
          ))}

          {/* Date cells */}
          {weeks.flat().map((date, index) => {
            if (!date) return <div key={`empty-cell-${index}`} className="w-[12px] h-[12px]" />;

            const level = getCompletionLevel(habit.completions, date);
            const isCompleted = habit.completions[date];
            const isSelected = selectedDates.has(date);
            
            return (
              <motion.button
                key={date}
                layout="position"
                whileHover={{ scale: 1.2, zIndex: 10 }}
                whileTap={{ scale: 0.9 }}
                onMouseDown={() => handleDragStart(date)}
                onMouseEnter={() => {
                  setHoveredDate(date);
                  if (isDragging) handleDrag(date);
                }}
                onMouseUp={handleDragEnd}
                className={`relative w-[12px] h-[12px] group/cell
                  ${isSelected ? 'ring-2' : 'hover:ring-1'}
                  transition-all duration-200
                `}
              >
                <motion.div
                  layout="position"
                  className="absolute inset-0 rounded"
                  style={{
                    backgroundColor: !isCompleted ? '#2a2a2a' : habit.color,
                    opacity: isCompleted ? 0.25 + (level * 0.25) : 1,
                  }}
                >
                  <motion.div
                    className="absolute inset-0 opacity-0 group-hover/cell:opacity-100 transition-opacity duration-200"
                    style={{
                      background: `radial-gradient(circle at center, ${habit.color}30 0%, transparent 70%)`
                    }}
                  />
                </motion.div>

                <AnimatePresence>
                  {hoveredDate === date && !isDragging && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.9 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.9 }}
                      className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-[#2a2a2a] rounded-md text-xs whitespace-nowrap z-20 shadow-lg"
                      style={{
                        background: 'linear-gradient(to bottom, #2a2a2a, #222)',
                        border: '1px solid #333'
                      }}
                    >
                      <div className="font-medium">
                        {new Date(date).toLocaleDateString(undefined, { 
                          weekday: 'long',
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </div>
                      <div className="text-gray-400 mt-1 flex items-center gap-1">
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{
                            backgroundColor: isCompleted ? habit.color : '#444'
                          }}
                        />
                        {isCompleted ? 'Completed' : 'No activity'}
                      </div>
                      {isDragging && (
                        <div className="text-gray-400 mt-1 text-[10px]">
                          Release to confirm selection
                        </div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>
            );
          })}

          {/* Empty cells for remaining days */}
          {Array.from({ length: 6 - weeks[weeks.length - 1].findIndex(date => date !== null) }).map((_, index) => (
            <div
              key={`empty-end-${index}`}
              className="w-[12px] h-[12px] rounded border border-[#2a2a2a] bg-[#1a1a1a] opacity-30"
            />
          ))}
        </div>
      </div>

      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="bg-[#1a1a1a] p-6 rounded-lg shadow-xl relative group"
      >
        {/* Glowing outline on hover */}
        <motion.div
          className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500"
          style={{
            boxShadow: `0 0 20px ${habit.color}15`,
            border: `1px solid ${habit.color}30`
          }}
        />

        <motion.div layout className="flex items-center space-x-3 mb-6">
          <motion.div
            whileHover={{ scale: 1.2 }}
            className="relative"
          >
            <span
              className="text-2xl font-medium block"
              style={{ color: habit.color }}
            >
              ●
            </span>
            <motion.div
              animate={{
                scale: [1, 1.2, 1],
                opacity: [0.2, 0.5, 0.2]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
              className="absolute inset-0 rounded-full"
              style={{
                backgroundColor: habit.color,
                filter: 'blur(8px)'
              }}
            />
          </motion.div>

          <motion.div layout className="flex-1 text-lg font-medium tracking-tight">
            {habit.name}
          </motion.div>

          <motion.div
            layout
            className="bg-[#2a2a2a] px-4 py-1.5 rounded-full text-sm font-medium tracking-wide relative overflow-hidden group/streak"
          >
            <motion.div
              className="absolute inset-0 opacity-0 group-hover/streak:opacity-100 transition-opacity"
              style={{
                background: `linear-gradient(45deg, ${habit.color}10, transparent, ${habit.color}10)`
              }}
            />
            <span className="relative">
              {habit.streak} DAY STREAK
            </span>
          </motion.div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setShowDeleteConfirm(true)}
            className="text-gray-400 hover:text-red-500 transition-colors px-2 text-xl relative group/delete"
          >
            ×
            <motion.span
              className="absolute -inset-2 rounded-full bg-red-500/10 opacity-0 group-hover/delete:opacity-100 transition-opacity"
            />
          </motion.button>
        </motion.div>

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
                <p className="text-gray-400 mb-6">Are you sure you want to delete &ldquo;{habit.name}&rdquo;? This action cannot be undone.</p>
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
    </>
  );
} 