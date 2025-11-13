import type { AppState, Task } from '@types';
import { deleteTask, deleteColumn, sortByIndex } from '@utils';

// --- 1. DELETE ZONE ---
const handleDeleteZone = (prev: AppState, sourceData: { type: string; id: number }): AppState => {
  if (sourceData.type === 'task') return deleteTask(prev, sourceData.id);
  if (sourceData.type === 'column') return deleteColumn(prev, sourceData.id);
  return prev;
};

// --- 2. TASK → TASK ---
const moveTaskToTask = (prev: AppState, sourceId: number, targetId: number): AppState => {
  const movingTask = prev.tasks.find((t) => t.id === sourceId);
  const targetTask = prev.tasks.find((t) => t.id === targetId);
  if (!movingTask || !targetTask) return prev;

  let newIndex = targetTask.index ?? 0;
  if (movingTask.columnId === targetTask.columnId && movingTask.index === targetTask.index) {
    newIndex = (targetTask.index ?? 0) + 1;
  }

  const updatedTasks = prev.tasks.map((t) => {
    if (t.id === movingTask.id) return { ...t, columnId: targetTask.columnId, index: newIndex };
    if (t.id === targetTask.id) return { ...t, index: movingTask.index ?? 0 };
    return t;
  });

  return { ...prev, tasks: reindexTasks(updatedTasks) };
};

// --- 3. TASK → COLUMN ---
const moveTaskToColumn = (prev: AppState, sourceId: number, targetColumnId: number): AppState => {
  const movingTask = prev.tasks.find((t) => t.id === sourceId);
  if (!movingTask) return prev;

  const otherTasks = prev.tasks.filter((t) => t.id !== sourceId);
  const tasksInColumn = otherTasks
    .filter((t) => t.columnId === targetColumnId)
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

  const updatedTasksInColumn = [
    ...tasksInColumn,
    { ...movingTask, columnId: targetColumnId, index: tasksInColumn.length },
  ].map((t, i) => ({ ...t, index: i }));

  const updatedOtherTasks = otherTasks.filter((t) => t.columnId !== targetColumnId);

  return { ...prev, tasks: [...updatedOtherTasks, ...updatedTasksInColumn] };
};

// --- 4. TASK → TASKS-LIST (unassigned) ---
const moveTaskToUnassigned = (prev: AppState, sourceId: number): AppState => {
  const movingTask = prev.tasks.find((t) => t.id === sourceId);
  if (!movingTask) return prev;

  const otherTasks = prev.tasks.filter((t) => t.id !== sourceId);
  const unassignedTasks = otherTasks
    .filter((t) => !t.columnId)
    .sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

  const updatedUnassigned = [
    ...unassignedTasks,
    { ...movingTask, columnId: undefined, index: unassignedTasks.length },
  ].map((t, i) => ({ ...t, index: i }));

  const updatedOtherTasks = otherTasks.filter((t) => t.columnId);

  return { ...prev, tasks: [...updatedOtherTasks, ...updatedUnassigned] };
};

// --- 5. COLUMN → COLUMN ---
const moveColumnToColumn = (prev: AppState, sourceId: number, targetId: number): AppState => {
  const sourceColumn = prev.columns.find((col) => col.id === sourceId);
  const targetColumn = prev.columns.find((col) => col.id === targetId);
  if (!sourceColumn || !targetColumn) return prev;

  const updatedColumns = prev.columns.map((col) => {
    if (col.id === sourceColumn.id) return { ...col, index: targetColumn.index };
    if (col.id === targetColumn.id) return { ...col, index: sourceColumn.index };
    return col;
  });

  return { ...prev, columns: updatedColumns };
};

// --- HELPER: reindex tasks by column ---
const reindexTasks = (tasks: Task[]): Task[] => {
  const grouped: Record<number, Task[]> = {};
  tasks.forEach((t) => {
    const cid = t.columnId ?? -1;
    if (!grouped[cid]) grouped[cid] = [];
    grouped[cid].push(t);
  });

  const finalTasks: Task[] = [];
  Object.values(grouped).forEach((tasks) => {
    sortByIndex(tasks);
    tasks.forEach((t, i) => (t.index = i));
    finalTasks.push(...tasks);
  });

  return finalTasks;
};

export const handleDrop = (
  prev: AppState,
  sourceData: { type: string; id: number },
  targetData: { type: string; id?: number } | null
): AppState => {
  if (!sourceData) return prev;

  const { type: sourceType, id: sourceId } = sourceData;
  const targetType = targetData?.type;
  const targetId = targetData?.id;

  if (targetType === 'delete-zone') return handleDeleteZone(prev, sourceData);

  if (sourceType === 'task') {
    if (targetType === 'task' && targetId) return moveTaskToTask(prev, sourceId, targetId);
    if (targetType === 'column' && targetId) return moveTaskToColumn(prev, sourceId, targetId);
    if (targetType === 'tasks-list') return moveTaskToUnassigned(prev, sourceId);
  }

  if (sourceType === 'column' && targetType === 'column' && targetId) {
    return moveColumnToColumn(prev, sourceId, targetId);
  }

  return prev;
};
