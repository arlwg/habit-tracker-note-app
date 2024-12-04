'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Note {
  id: string;
  title: string;
  content: string;
  color: string;
  createdAt: string;
}

interface NoteStore {
  notes: Note[];
  addNote: (note: Omit<Note, 'id' | 'createdAt'>) => void;
  deleteNote: (id: string) => void;
  updateNote: (id: string, updates: Partial<Omit<Note, 'id' | 'createdAt'>>) => void;
}

const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      notes: [],
      
      addNote: (noteData) => {
        const newNote: Note = {
          id: Math.random().toString(36).substr(2, 9),
          ...noteData,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ notes: [...state.notes, newNote] }));
      },

      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id),
        }));
      },

      updateNote: (id, updates) => {
        set((state) => ({
          notes: state.notes.map((note) =>
            note.id === id ? { ...note, ...updates } : note
          ),
        }));
      },
    }),
    {
      name: 'notes-storage',
    }
  )
);

export default useNoteStore; 