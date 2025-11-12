import type { Column, Task } from '@types';

export const createColumn = (title: string, index: number): Column => ({
  id: Date.now(),
  title,
  index,
});

export const createTask = (text: string): Task => ({
  id: Date.now(),
  text,
  isCompleted: false,
});
