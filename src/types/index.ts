interface BasicAttributes {
  id: number;
  index: number;
  isMarked: boolean;
}

export interface Task extends BasicAttributes {
  text: string;
  isCompleted: boolean;
  columnId?: number;
}

export interface Column extends BasicAttributes {
  title: string;
}

export interface AppState {
  tasks: Task[];
  columns: Column[];
  filter: FilterType;
  createOption: CreateOption;
}

export type FilterType = 'all' | 'completed' | 'incomplete';

export type CreateOption = 'column' | 'task';

export interface Option<T> {
  label: string;
  value: T;
}
