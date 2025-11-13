import type { Column, Task, AppState } from '@types';

export const createColumn = (title: string, index: number): Column => ({
  id: Date.now(),
  title,
  index,
  isMarked: false,
});

export const createTask = (text: string, index: number): Task => ({
  id: Date.now(),
  text,
  index,
  isCompleted: false,
  isMarked: false,
});

export const deleteTask = (state: AppState, taskId: number) => {
  const updatedTasks = state.tasks
    .filter((task) => task.id !== taskId)
    .map((item, i) => ({ ...item, index: i }));

  return {
    ...state,
    tasks: updatedTasks,
  };
};

export const deleteColumn = (state: AppState, columnId: number): AppState => {
  const updatedColumns = state.columns.filter((column) => column.id !== columnId);

  const updatedTasks = state.tasks.map((task) => {
    if (task.columnId === columnId) {
      return { ...task, columnId: undefined };
    }
    return task;
  });

  const unassignedTasks = updatedTasks.filter((t) => !t.columnId);
  const assignedTasks = updatedTasks.filter((t) => t.columnId);

  const reindexedUnassigned = unassignedTasks.map((t, i) => ({ ...t, index: i }));
  const reindexedAssigned = assignedTasks.map((t, i) => ({ ...t, index: i }));

  return {
    ...state,
    columns: updatedColumns,
    tasks: [...reindexedAssigned, ...reindexedUnassigned],
  };
};
