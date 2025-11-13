import type { AppState } from '@types';
import { deleteTask, deleteColumn } from '@utils';

export const handleDrop = (
  prev: AppState,
  sourceData: { type: string; id: number },
  targetData: { type: string; id?: number } | null
): AppState => {
  if (!sourceData) return prev;

  const sourceType = sourceData.type;
  const sourceId = sourceData.id;

  const targetType = targetData?.type;
  const targetId = targetData?.id;

  // --- 1. DELETE ZONE ---
  if (targetType === 'delete-zone') {
    if (sourceType === 'task') return deleteTask(prev, sourceId);
    if (sourceType === 'column') return deleteColumn(prev, sourceId);
    return prev;
  }

  // --- 2. TASK на TASK ---
  if (sourceType === 'task') {
    const movingTask = prev.tasks.find((t) => t.id === sourceId);
    if (!movingTask) return prev;

    // --- dropped on task ---
    if (targetType === 'task' && targetId) {
      const targetTask = prev.tasks.find((t) => t.id === targetId);
      if (!targetTask) return prev;

      let newIndex = targetTask.index ?? 0;
      // якщо індекси однакові
      if (movingTask.columnId === targetTask.columnId && movingTask.index === targetTask.index) {
        newIndex = (targetTask.index ?? 0) + 1;
      }

      const updatedTasks = prev.tasks.map((t) => {
        if (t.id === movingTask.id) return { ...t, columnId: targetTask.columnId, index: newIndex };
        if (t.id === targetTask.id) return { ...t, index: movingTask.index ?? 0 };
        return t;
      });

      // перераховуємо індекси всіх тасок у колонці
      const allTasks = updatedTasks.map((t) => ({ ...t })); // копія
      const grouped: Record<number, typeof allTasks> = {};
      allTasks.forEach((t) => {
        const cid = t.columnId ?? -1;
        if (!grouped[cid]) grouped[cid] = [];
        grouped[cid].push(t);
      });
      const finalTasks: typeof allTasks = [];
      Object.values(grouped).forEach((tasks) => {
        tasks.sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
        tasks.forEach((t, i) => (t.index = i));
        finalTasks.push(...tasks);
      });

      return { ...prev, tasks: finalTasks };
    }

    // --- dropped on column ---
    if (targetType === 'column' && targetId) {
      const newColumnId = targetId;
      const otherTasks = prev.tasks.filter((t) => t.id !== movingTask.id);
      const tasksInColumn = otherTasks
        .filter((t) => t.columnId === newColumnId)
        .sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

      const newIndex = tasksInColumn.length > 0 ? tasksInColumn.length : 0;

      const updatedTasksInColumn = [
        ...tasksInColumn,
        { ...movingTask, columnId: newColumnId, index: newIndex },
      ].map((t, i) => ({ ...t, index: i }));

      const updatedOtherTasks = otherTasks.filter((t) => t.columnId !== newColumnId);

      return { ...prev, tasks: [...updatedOtherTasks, ...updatedTasksInColumn] };
    }

    // --- dropped on tasks-list (unassigned) ---
    if (targetType === 'tasks-list') {
      const otherTasks = prev.tasks.filter((t) => t.id !== movingTask.id);
      const unassignedTasks = otherTasks
        .filter((t) => !t.columnId)
        .sort((a, b) => (a.index ?? 0) - (b.index ?? 0));

      const newIndex = unassignedTasks.length;
      const updatedUnassigned = [
        ...unassignedTasks,
        { ...movingTask, columnId: undefined, index: newIndex },
      ].map((t, i) => ({ ...t, index: i }));

      const updatedOtherTasks = otherTasks.filter((t) => t.columnId);

      return { ...prev, tasks: [...updatedOtherTasks, ...updatedUnassigned] };
    }
  }

  // --- 5. COLUMN на COLUMN ---
  if (targetType === 'column' && sourceType === 'column') {
    const sourceColumn = prev.columns.find((col) => col.id === sourceId);
    const targetColumn = prev.columns.find((col) => col.id === targetId);
    if (!sourceColumn || !targetColumn) return prev;

    const updatedColumns = prev.columns.map((col) => {
      if (col.id === sourceColumn.id) {
        return { ...col, index: targetColumn.index };
      }
      if (col.id === targetColumn.id) {
        return { ...col, index: sourceColumn.index };
      }
      return col;
    });

    return { ...prev, columns: updatedColumns };
  }

  return prev;
};
