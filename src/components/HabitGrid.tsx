import { useState } from 'react';

const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export default function HabitGrid() {
  const [streak, setStreak] = useState(0);
  
  return (
    <div className="bg-[#1a1a1a] p-6 rounded-lg">
      <div className="flex items-center space-x-2 mb-4">
        <span className="text-2xl">g</span>
        <div className="bg-[#2a2a2a] px-3 py-1 rounded-full text-sm">
          {streak} DAY STREAK
        </div>
      </div>
      
      <div className="grid grid-cols-9 gap-1">
        {months.map((month) => (
          <div key={month} className="text-gray-400 text-sm mb-1">
            {month}
          </div>
        ))}
        
        {[...Array(9 * 15)].map((_, i) => {
          const isCompleted = i < 3; // First three days marked as completed
          return (
            <div
              key={i}
              className={`w-full pt-[100%] relative ${
                isCompleted ? 'bg-green-500' : 'bg-[#2a2a2a]'
              } rounded-sm`}
            />
          );
        })}
      </div>
    </div>
  );
} 