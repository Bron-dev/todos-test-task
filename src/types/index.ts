export interface Task {
  id: number;
  text: string;
  isCompleted: boolean;
  index?: number;
  columnId?: number;
}

export interface Column {
  id: number;
  title: string;
  index: number;
}

export interface AppState {
  tasks: Task[];
  columns: Column[];
}

export type FilterType = 'all' | 'completed' | 'incomplete';

export type CreateOption = 'column' | 'task';
