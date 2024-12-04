'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import useHabitStore from '@/store/habitStore';

const colors = [
  '#10B981', // green
  '#3B82F6', // blue
  '#EC4899', // pink
  '#F59E0B', // yellow
  '#8B5CF6', // purple
  '#EF4444', // red
];

interface Props {
  onClose: () => void;
}

export default function CreateHabitModal({ onClose }: Props) {
  const [name, setName] = useState('');
  const [color, setColor] = useState(colors[0]);
  const [startDate, setStartDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today.toISOString().split('T')[0];
  });
  const addHabit = useHabitStore((state) => state.addHabit);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addHabit({ name: name.trim(), color, startDate });
      onClose();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-[#1a1a1a] p-6 rounded-lg max-w-sm w-full"
      >
        <h2 className="text-2xl mb-6">Create New Habit</h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-[#2a2a2a] p-2 rounded border border-[#3a3a3a] focus:border-blue-500 focus:outline-none"
              placeholder="e.g., Read a book"
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Start Date</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full bg-[#2a2a2a] p-2 rounded border border-[#3a3a3a] focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-400 mb-2">Color</label>
            <div className="grid grid-cols-6 gap-2">
              {colors.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`w-8 h-8 rounded-full transition-transform ${
                    c === color ? 'scale-125' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                />
              ))}
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] p-2 rounded transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-500 hover:bg-blue-600 p-2 rounded transition-colors"
              disabled={!name.trim()}
            >
              Create
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
} 