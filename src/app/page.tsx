'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useHabitStore from '@/store/habitStore';
import HabitGrid from '@/components/HabitGrid';
import Header from '@/components/Header';
import CreateHabitModal from '@/components/CreateHabitModal';
import Sidebar from '@/components/Sidebar';
import Notes from '@/components/Notes';

export default function Home() {
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [currentView, setCurrentView] = useState<'habits' | 'notes'>('habits');
  const habits = useHabitStore((state) => state.habits);

  return (
    <div className="flex">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      
      <main className="min-h-screen bg-[#121212] text-white p-4 flex-1 ml-[240px]">
        <div className="max-w-4xl mx-auto space-y-8">
          <Header />
          
          <AnimatePresence mode="wait">
            {currentView === 'habits' ? (
              <motion.div
                key="habits"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-8"
              >
                <div>
                  <h1 className="text-6xl font-bold text-center">habits</h1>
                  <p className="text-gray-400 text-center text-xl">Track your habits every day</p>
                </div>

                <motion.div layout className="space-y-4">
                  {habits.map((habit) => (
                    <motion.div
                      key={habit.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                    >
                      <HabitGrid habit={habit} />
                    </motion.div>
                  ))}
                </motion.div>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateModal(true)}
                  className="w-full bg-[#2a2a2a] hover:bg-[#3a3a3a] p-4 rounded-lg flex items-center justify-center space-x-2 transition-colors"
                >
                  <span className="text-2xl">+</span>
                  <span className="text-xl">Create Habit</span>
                </motion.button>
              </motion.div>
            ) : (
              <motion.div
                key="notes"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="mb-8">
                  <h1 className="text-6xl font-bold text-center">notes</h1>
                  <p className="text-gray-400 text-center text-xl">Capture your thoughts</p>
                </div>
                <Notes />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <AnimatePresence>
          {showCreateModal && (
            <CreateHabitModal onClose={() => setShowCreateModal(false)} />
          )}
        </AnimatePresence>
      </main>
    </div>
  );
} 