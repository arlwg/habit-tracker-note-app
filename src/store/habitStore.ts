'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Habit, HabitStore } from '@/types/habit';
import QRCode from 'qrcode';

const useHabitStore = create<HabitStore>()(
  persist(
    (set, get) => ({
      habits: [],
      
      addHabit: (habitData) => {
        const newHabit: Habit = {
          id: uuidv4(),
          ...habitData,
          streak: 0,
          completions: {},
        };
        set((state) => ({ habits: [...state.habits, newHabit] }));
      },

      deleteHabit: (habitId) => {
        set((state) => ({
          habits: state.habits.filter((h) => h.id !== habitId)
        }));
      },

      toggleCompletion: (habitId, date) => {
        set((state) => {
          const habit = state.habits.find((h) => h.id === habitId);
          if (!habit) return state;

          const newCompletions = { ...habit.completions };
          newCompletions[date] = !newCompletions[date];

          // Calculate streak
          let streak = 0;
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          const currentDate = new Date(today);

          // First check if today is completed
          const todayStr = currentDate.toISOString().split('T')[0];
          if (!newCompletions[todayStr]) {
            streak = 0;
          } else {
            streak = 1;
            // Then count backwards from yesterday
            currentDate.setDate(currentDate.getDate() - 1);
            
            while (true) {
              const dateStr = currentDate.toISOString().split('T')[0];
              if (!newCompletions[dateStr]) {
                break;
              }
              streak++;
              currentDate.setDate(currentDate.getDate() - 1);
            }
          }

          const updatedHabits = state.habits.map((h) =>
            h.id === habitId
              ? { ...h, completions: newCompletions, streak }
              : h
          );

          return { habits: updatedHabits };
        });
      },

      syncData: async () => {
        const state = get();
        const data = JSON.stringify(state.habits);
        const qrData = await QRCode.toDataURL(data);
        
        // Create and show modal with QR code
        const modal = document.createElement('div');
        modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
        modal.innerHTML = `
          <div class="bg-[#1a1a1a] p-6 rounded-lg max-w-sm w-full mx-4">
            <h3 class="text-xl mb-4 text-center">Scan to Sync</h3>
            <img src="${qrData}" alt="QR Code" class="w-full"/>
            <p class="text-sm text-gray-400 mt-4 text-center">Scan this QR code with another device to sync your habits</p>
            <button class="w-full mt-4 bg-[#2a2a2a] hover:bg-[#3a3a3a] p-2 rounded transition-colors">Close</button>
          </div>
        `;
        
        document.body.appendChild(modal);
        modal.querySelector('button')?.addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
          if (e.target === modal) modal.remove();
        });
      },
    }),
    {
      name: 'habits-storage',
    }
  )
);

export default useHabitStore; 