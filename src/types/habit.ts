export interface Habit {
  id: string;
  name: string;
  color: string;
  streak: number;
  completions: { [date: string]: boolean };
  startDate?: string;
}

export type HabitStore = {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'completions'>) => void;
  deleteHabit: (habitId: string) => void;
  toggleCompletion: (habitId: string, date: string) => void;
  syncData: () => void;
} 