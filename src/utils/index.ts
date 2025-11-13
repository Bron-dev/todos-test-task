import type { Column, Task, AppState } from '@types';

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

export const reorder = <T extends { index: number }>(
  list: T[],
  startIndex: number,
  endIndex: number
): T[] => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);

  result.splice(endIndex, 0, removed);

  return result.map((item, index) => ({ ...item, index }));
};

export const insertItemAt = <T extends { index: number }>(
  list: T[],
  index: number,
  newItem: T
): T[] => {
  const updatedItems = list.map((item) =>
    item.index >= index ? { ...item, index: item.index + 1 } : item
  );

  updatedItems.splice(index, 0, newItem);

  return updatedItems;
};

export const moveTask = (
  prev: AppState,
  taskId: number,
  newColumnId?: number,
  newIndex?: number
): AppState => {
  const movingTask = prev.tasks.find((t) => t.id === taskId);
  if (!movingTask) return prev;

  const otherTasks = prev.tasks.filter((t) => t.id !== taskId);
  const tasksInTarget = otherTasks
    .filter((t) => t.columnId === newColumnId)
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

  const index = newIndex ?? tasksInTarget.length;
  const updatedTasksInTarget = insertItemAt(tasksInTarget, index, {
    ...movingTask,
    columnId: newColumnId,
    index,
  });

  const updatedTasks = [
    ...otherTasks.filter((t) => t.columnId !== newColumnId),
    ...updatedTasksInTarget,
  ];

  return { ...prev, tasks: updatedTasks };
};

export const reorderColumn = (prev: AppState, fromId: number, toId: number): AppState => {
  const cols = [...prev.columns].sort((a, b) => a.index - b.index);
  const fromIndex = cols.findIndex((c) => c.id === fromId);
  const toIndex = cols.findIndex((c) => c.id === toId);

  if (fromIndex === -1 || toIndex === -1 || fromIndex === toIndex) return prev;

  const updatedCols = reorder(cols, fromIndex, toIndex);
  return { ...prev, columns: updatedCols };
};
