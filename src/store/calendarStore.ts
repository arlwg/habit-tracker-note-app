'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

export interface CalendarNote {
  id: string;
  title: string;
  content: string;
  color: string;
  date: string;
  createdAt: string;
  tags: string[];
  linkedNoteIds: string[];
}

interface CalendarStore {
  calendarNotes: CalendarNote[];
  addCalendarNote: (note: Omit<CalendarNote, 'id' | 'createdAt'>) => void;
  deleteCalendarNote: (id: string) => void;
  updateCalendarNote: (id: string, note: Partial<CalendarNote>) => void;
  getNotesForDate: (date: string) => CalendarNote[];
}

const useCalendarStore = create<CalendarStore>()(
  persist(
    (set, get) => ({
      calendarNotes: [],
      
      addCalendarNote: (noteData) => {
        const newNote: CalendarNote = {
          id: uuidv4(),
          ...noteData,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ calendarNotes: [...state.calendarNotes, newNote] }));
      },

      deleteCalendarNote: (id) => {
        set((state) => ({
          calendarNotes: state.calendarNotes.filter((note) => note.id !== id)
        }));
      },

      updateCalendarNote: (id, noteData) => {
        set((state) => ({
          calendarNotes: state.calendarNotes.map((note) =>
            note.id === id ? { ...note, ...noteData } : note
          )
        }));
      },

      getNotesForDate: (date) => {
        return get().calendarNotes.filter((note) => note.date === date);
      },
    }),
    {
      name: 'calendar-storage',
    }
  )
);

export default useCalendarStore;
