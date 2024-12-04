'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';

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
}

const useNoteStore = create<NoteStore>()(
  persist(
    (set) => ({
      notes: [],
      
      addNote: (noteData) => {
        const newNote: Note = {
          id: uuidv4(),
          ...noteData,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ notes: [...state.notes, newNote] }));
      },

      deleteNote: (id) => {
        set((state) => ({
          notes: state.notes.filter((note) => note.id !== id)
        }));
      },
    }),
    {
      name: 'notes-storage',
    }
  )
);

export default useNoteStore; 