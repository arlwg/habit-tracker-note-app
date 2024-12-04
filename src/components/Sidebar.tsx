'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface SidebarProps {
  currentView: 'habits' | 'notes' | 'calendar';
  onViewChange: (view: 'habits' | 'notes' | 'calendar') => void;
  isExpanded: boolean;
  onToggleExpand: () => void;
}

interface NavItem {
  id: 'habits' | 'notes' | 'calendar';
  icon: string;
  label: string;
  color: string;
}

const navItems: NavItem[] = [
  { id: 'habits', icon: '🎯', label: 'Habits', color: '#3B82F6' },
  { id: 'notes', icon: '📝', label: 'Notes', color: '#10B981' },
  { id: 'calendar', icon: '📅', label: 'Calendar', color: '#8B5CF6' },
];

export default function Sidebar({ currentView, onViewChange, isExpanded, onToggleExpand }: SidebarProps) {
  const [hoveredItem, setHoveredItem] = useState<string | null>(null);

  return (
    <motion.div
      initial={{ width: 240 }}
      animate={{ width: isExpanded ? 240 : 72 }}
      className="fixed left-0 top-0 h-screen bg-[#1a1a1a] border-r border-[#2a2a2a] z-50 flex flex-col"
      style={{
        boxShadow: '4px 0 10px rgba(0, 0, 0, 0.1)',
      }}
    >
      {/* Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggleExpand}
        className="absolute right-[-16px] top-8 w-8 h-8 bg-[#2a2a2a] rounded-full flex items-center justify-center shadow-lg border border-[#3a3a3a] hover:bg-[#3a3a3a] transition-colors"
        style={{
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        }}
      >
        <motion.span
          animate={{ rotate: isExpanded ? 0 : 180 }}
          className="text-sm"
        >
          {isExpanded ? '◀' : '▶'}
        </motion.span>
      </motion.button>

      {/* Logo Area */}
      <motion.div
        className="p-4 mb-6 border-b border-[#2a2a2a]"
        animate={{ 
          paddingLeft: isExpanded ? '1.5rem' : '0.75rem',
          paddingRight: isExpanded ? '1.5rem' : '0.75rem'
        }}
      >
        <motion.div
          className="flex items-center space-x-3"
          animate={{ justifyContent: isExpanded ? 'flex-start' : 'center' }}
        >
          <span className="text-2xl">⚡</span>
          <AnimatePresence>
            {isExpanded && (
              <motion.span
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                exit={{ opacity: 0, width: 0 }}
                className="font-bold text-lg whitespace-nowrap"
              >
                EzWebsite
              </motion.span>
            )}
          </AnimatePresence>
        </motion.div>
      </motion.div>

      {/* Navigation Items */}
      <div className="flex-1 px-2 space-y-2">
        {navItems.map((item) => (
          <motion.button
            key={item.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onViewChange(item.id)}
            onMouseEnter={() => setHoveredItem(item.id)}
            onMouseLeave={() => setHoveredItem(null)}
            className="relative w-full rounded-lg flex items-center transition-all duration-200 group"
            style={{
              height: '48px',
              padding: isExpanded ? '0 0.75rem' : '0',
              justifyContent: isExpanded ? 'flex-start' : 'center',
            }}
          >
            {/* Background highlight */}
            <motion.div
              className="absolute inset-0 rounded-lg"
              animate={{
                backgroundColor: currentView === item.id ? item.color : 
                  hoveredItem === item.id ? '#2a2a2a' : 'transparent',
                opacity: currentView === item.id ? 0.15 : 1,
              }}
              transition={{ duration: 0.2 }}
            />

            {/* Active indicator */}
            {currentView === item.id && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute left-0 top-0 bottom-0 w-1 rounded-full"
                style={{ backgroundColor: item.color }}
              />
            )}

            {/* Icon */}
            <span className="relative text-xl z-10">{item.icon}</span>

            {/* Label */}
            <AnimatePresence>
              {isExpanded && (
                <motion.span
                  initial={{ opacity: 0, width: 0 }}
                  animate={{ opacity: 1, width: 'auto' }}
                  exit={{ opacity: 0, width: 0 }}
                  className="ml-3 font-medium whitespace-nowrap relative z-10"
                  style={{
                    color: currentView === item.id ? item.color : undefined
                  }}
                >
                  {item.label}
                </motion.span>
              )}
            </AnimatePresence>

            {/* Tooltip for collapsed state */}
            <AnimatePresence>
              {!isExpanded && hoveredItem === item.id && (
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="absolute left-full ml-2 px-3 py-2 bg-[#2a2a2a] rounded-lg text-sm whitespace-nowrap z-50 shadow-lg"
                  style={{
                    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                    border: '1px solid #3a3a3a'
                  }}
                >
                  {item.label}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.button>
        ))}
      </div>

      {/* User Profile Section */}
      <motion.div
        className="mt-auto p-4 border-t border-[#2a2a2a] flex items-center space-x-3"
        animate={{ 
          paddingLeft: isExpanded ? '1.5rem' : '0.75rem',
          paddingRight: isExpanded ? '1.5rem' : '0.75rem',
          justifyContent: isExpanded ? 'flex-start' : 'center'
        }}
      >
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-sm font-medium">
          K
        </div>
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, width: 0 }}
              animate={{ opacity: 1, width: 'auto' }}
              exit={{ opacity: 0, width: 0 }}
              className="flex-1 min-w-0"
            >
              <div className="font-medium truncate">Karl</div>
              <div className="text-xs text-gray-400 truncate">Settings</div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}