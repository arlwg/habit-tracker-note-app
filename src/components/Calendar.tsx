'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useCalendarStore from '@/store/calendarStore';
import useNoteStore from '@/store/noteStore';
import { CalendarNote } from '@/store/calendarStore';

const colors = [
  '#10B981', // green
  '#3B82F6', // blue
  '#EC4899', // pink
  '#F59E0B', // yellow
  '#8B5CF6', // purple
  '#EF4444', // red
];

const monthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    color: colors[0],
    tags: [],
    linkedNoteIds: [],
  });

  const calendarNotes = useCalendarStore((state) => state.calendarNotes);
  const addCalendarNote = useCalendarStore((state) => state.addCalendarNote);
  const deleteCalendarNote = useCalendarStore((state) => state.deleteCalendarNote);
  const notes = useNoteStore((state) => state.notes);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDay = firstDay.getDay();
    
    const days: { date: Date; isCurrentMonth: boolean }[] = [];
    
    // Add days from previous month
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();
    for (let i = startingDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - i),
        isCurrentMonth: false
      });
    }
    
    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true
      });
    }
    
    // Add days from next month
    const remainingDays = 42 - days.length; // 6 rows * 7 days = 42
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false
      });
    }
    
    return days;
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleDateClick = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDate(dateStr);
    setShowNoteModal(true);
  };

  const handleAddNote = () => {
    if (selectedDate && (newNote.title.trim() || newNote.content.trim())) {
      addCalendarNote({
        ...newNote,
        date: selectedDate,
      });
      setNewNote({
        title: '',
        content: '',
        color: colors[0],
        tags: [],
        linkedNoteIds: [],
      });
      setShowNoteModal(false);
    }
  };

  const days = getDaysInMonth(currentDate);
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="p-4">
      <div className="bg-[#1a1a1a] rounded-lg p-6 shadow-xl">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handlePrevMonth}
            className="p-2 hover:bg-[#2a2a2a] rounded-full"
          >
            ←
          </motion.button>
          <h2 className="text-xl font-semibold">
            {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
          </h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleNextMonth}
            className="p-2 hover:bg-[#2a2a2a] rounded-full"
          >
            →
          </motion.button>
        </div>

        {/* Calendar Grid */}
        <div className="grid grid-cols-7 gap-1 mb-2 text-center text-sm text-gray-500">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="p-2">{day}</div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map(({ date, isCurrentMonth }, index) => {
            const dateStr = date.toISOString().split('T')[0];
            const notesForDay = calendarNotes.filter(note => note.date === dateStr);
            const isToday = dateStr === today;

            return (
              <motion.button
                key={index}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDateClick(date)}
                className={`
                  relative aspect-square p-1 rounded-lg group
                  ${isCurrentMonth ? 'bg-[#2a2a2a]' : 'bg-[#222]'}
                  ${isToday ? 'ring-2 ring-blue-500' : ''}
                  hover:bg-[#3a3a3a] transition-colors
                `}
              >
                <span className={`
                  text-sm
                  ${isCurrentMonth ? 'text-white' : 'text-gray-600'}
                `}>
                  {date.getDate()}
                </span>
                {notesForDay.length > 0 && (
                  <div className="absolute bottom-1 left-1 right-1 flex gap-0.5 flex-wrap">
                    {notesForDay.slice(0, 3).map((note) => (
                      <div
                        key={note.id}
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: note.color }}
                      />
                    ))}
                    {notesForDay.length > 3 && (
                      <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
                    )}
                  </div>
                )}
              </motion.button>
            );
          })}
        </div>
      </div>

      {/* Note Modal */}
      <AnimatePresence>
        {showNoteModal && selectedDate && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            onClick={(e) => e.target === e.currentTarget && setShowNoteModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1a1a1a] p-6 rounded-lg w-full max-w-md"
            >
              <h3 className="text-lg font-semibold mb-4">
                Add Note for {new Date(selectedDate).toLocaleDateString()}
              </h3>
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
                    <motion.button
                      key={color}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => setNewNote({ ...newNote, color })}
                      className={`w-6 h-6 rounded-full ${
                        newNote.color === color ? 'ring-2 ring-white' : ''
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div>
                  <label className="text-sm text-gray-400 block mb-2">Link to Notes:</label>
                  <div className="space-y-2 max-h-32 overflow-y-auto">
                    {notes.map((note) => (
                      <label
                        key={note.id}
                        className="flex items-center space-x-2 text-sm"
                      >
                        <input
                          type="checkbox"
                          checked={newNote.linkedNoteIds.includes(note.id)}
                          onChange={(e) => {
                            const linkedNoteIds = e.target.checked
                              ? [...newNote.linkedNoteIds, note.id]
                              : newNote.linkedNoteIds.filter(id => id !== note.id);
                            setNewNote({ ...newNote, linkedNoteIds });
                          }}
                          className="rounded bg-[#2a2a2a] border-[#3a3a3a] text-blue-500 focus:ring-blue-500"
                        />
                        <span>{note.title}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-2 mt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowNoteModal(false)}
                    className="px-4 py-2 bg-[#2a2a2a] rounded hover:bg-[#3a3a3a]"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleAddNote}
                    className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    Add Note
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calendar Notes List */}
      {selectedDate && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 space-y-4"
        >
          <h3 className="text-lg font-semibold">
            Notes for {new Date(selectedDate).toLocaleDateString()}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {calendarNotes
              .filter((note) => note.date === selectedDate)
              .map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="group bg-[#1a1a1a] p-4 rounded-lg relative"
                  style={{ borderLeft: `4px solid ${note.color}` }}
                >
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => deleteCalendarNote(note.id)}
                    className="absolute top-2 right-2 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ×
                  </motion.button>
                  <h4 className="text-lg font-semibold mb-2">{note.title}</h4>
                  <p className="text-gray-400 whitespace-pre-wrap">{note.content}</p>
                  {note.linkedNoteIds.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm text-gray-500 mb-2">Linked Notes:</h5>
                      <div className="flex flex-wrap gap-2">
                        {notes
                          .filter((n) => note.linkedNoteIds.includes(n.id))
                          .map((linkedNote) => (
                            <span
                              key={linkedNote.id}
                              className="text-xs bg-[#2a2a2a] px-2 py-1 rounded"
                            >
                              {linkedNote.title}
                            </span>
                          ))}
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
