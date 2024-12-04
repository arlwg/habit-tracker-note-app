'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useNoteStore, { Note } from '@/store/noteStore';

const colors = [
  '#10B981', // green
  '#3B82F6', // blue
  '#EC4899', // pink
  '#F59E0B', // yellow
  '#8B5CF6', // purple
  '#EF4444', // red
];

export default function Notes() {
  const notes = useNoteStore((state) => state.notes);
  const addNote = useNoteStore((state) => state.addNote);
  const deleteNote = useNoteStore((state) => state.deleteNote);
  const [showNewNote, setShowNewNote] = useState(false);
  const [newNote, setNewNote] = useState({ title: '', content: '', color: colors[0] });

  const handleAddNote = () => {
    if (newNote.title.trim() || newNote.content.trim()) {
      addNote(newNote);
      setNewNote({ title: '', content: '', color: colors[0] });
      setShowNewNote(false);
    }
  };

  return (
    <div className="p-4">
      <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {notes.map((note) => (
            <motion.div
              key={note.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="group bg-[#1a1a1a] p-4 rounded-lg relative"
              style={{ borderLeft: `4px solid ${note.color}` }}
            >
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => deleteNote(note.id)}
                className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                ×
              </motion.button>
              <h3 className="text-lg font-semibold mb-2">{note.title}</h3>
              <p className="text-gray-400 whitespace-pre-wrap">{note.content}</p>
              <div className="text-xs text-gray-500 mt-4">
                {new Date(note.createdAt).toLocaleDateString()}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setShowNewNote(true)}
        className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg"
      >
        +
      </motion.button>

      <AnimatePresence>
        {showNewNote && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
            onClick={(e) => e.target === e.currentTarget && setShowNewNote(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1a1a1a] p-6 rounded-lg w-full max-w-md"
            >
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Title"
                  value={newNote.title}
                  onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                  className="w-full bg-[#2a2a2a] p-2 rounded border border-[#3a3a3a] focus:border-blue-500 focus:outline-none"
                />
                <textarea
                  placeholder="Content"
                  value={newNote.content}
                  onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                  className="w-full h-32 bg-[#2a2a2a] p-2 rounded border border-[#3a3a3a] focus:border-blue-500 focus:outline-none resize-none"
                />
                <div className="flex space-x-2">
                  {colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setNewNote({ ...newNote, color })}
                      className={`w-6 h-6 rounded-full transition-transform ${
                        color === newNote.color ? 'scale-125' : 'hover:scale-110'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setShowNewNote(false)}
                    className="flex-1 bg-[#2a2a2a] hover:bg-[#3a3a3a] p-2 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleAddNote}
                    className="flex-1 bg-blue-500 hover:bg-blue-600 p-2 rounded"
                    disabled={!newNote.title.trim() && !newNote.content.trim()}
                  >
                    Add Note
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
} 