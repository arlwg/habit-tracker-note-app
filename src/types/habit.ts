export interface Habit {
  id: string;
  name: string;
  color: string;
  streak: number;
  completions: { [date: string]: boolean };
}

export type HabitStore = {
  habits: Habit[];
  addHabit: (habit: Omit<Habit, 'id' | 'streak' | 'completions'>) => void;
  toggleCompletion: (habitId: string, date: string) => void;
  syncData: () => void;
} 