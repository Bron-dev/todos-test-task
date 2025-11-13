import type { AppState, CreateOption, FilterType, Option } from '@types';

export const INITIAL_STATE: AppState = {
  tasks: [],
  columns: [],
  filter: 'all',
  createOption: 'column',
};

export const FILTER_OPTIONS: Option<FilterType>[] = [
  { label: 'All', value: 'all' },
  { label: 'Incomplete', value: 'incomplete' },
  { label: 'Completed', value: 'completed' },
];

export const CREATE_OPTIONS: Option<CreateOption>[] = [
  { label: 'Column', value: 'column' },
  { label: 'Task', value: 'task' },
];
