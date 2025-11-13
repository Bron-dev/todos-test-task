import { useCallback, useEffect, useMemo, useState } from 'react';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { useLocalStorage } from '@hooks/useLocalStorage.ts';
import { createColumn, createTask, deleteColumn, deleteTask, sortByIndex } from '@utils';
import { handleDrop } from '@utils/dragAndDrop.ts';
import type { AppState, CreateOption, Task } from '@types';
import { INITIAL_STATE } from '@constants';

export const useApp = () => {
  const [appState, setAppState] = useLocalStorage<AppState>('appState', INITIAL_STATE);
  const [isDragging, setIsDragging] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleAddBtnClick = useCallback(
    (type: CreateOption, title: string) => {
      if (!title.trim()) return;

      setAppState((prev) => {
        if (type === 'column') {
          return {
            ...prev,
            columns: [...prev.columns, createColumn(title, prev.columns.length)],
          };
        } else {
          return {
            ...prev,
            tasks: [...prev.tasks, createTask(title, prev.tasks.length)],
          };
        }
      });
    },
    [setAppState]
  );

  const handleUpdateTask = useCallback(
    (updatedTask: Task) => {
      setAppState((prev) => {
        const tasks = prev.tasks.map((t) =>
          t.id === updatedTask.id ? { ...t, ...updatedTask } : t
        );
        return { ...prev, tasks };
      });
    },
    [setAppState]
  );

  const handleDeleteColumn = useCallback(
    (columnId: number) => {
      setAppState((prev) => deleteColumn(prev, columnId));
    },
    [setAppState]
  );

  const handleDeleteTask = useCallback(
    (taskId: number) => {
      setAppState((prev) => deleteTask(prev, taskId));
    },
    [setAppState]
  );

  const toggleColumnCheckmark = useCallback(
    (columnId: number) => {
      setAppState((prev) => {
        const updatedColumns = prev.columns.map((col) =>
          col.id === columnId ? { ...col, isMarked: !col.isMarked } : col
        );

        const column = updatedColumns.find((col) => col.id === columnId);
        const newMarked = column?.isMarked ?? false;

        const updatedTasks = prev.tasks.map((task) =>
          task.columnId === columnId ? { ...task, isMarked: newMarked } : task
        );

        return { ...prev, columns: updatedColumns, tasks: updatedTasks };
      });
    },
    [setAppState]
  );

  const handleBulkDelete = useCallback(() => {
    setAppState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => !task.isMarked),
    }));
  }, [setAppState]);

  const handleBulkComplete = useCallback(() => {
    setAppState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.isMarked ? { ...task, isCompleted: true, isMarked: false } : task
      ),
    }));
  }, [setAppState]);

  const handleBulkIncomplete = useCallback(() => {
    setAppState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.isMarked ? { ...task, isCompleted: false, isMarked: false } : task
      ),
    }));
  }, [setAppState]);

  const handleBulkMove = useCallback(
    (targetColumnId: string) => {
      if (!targetColumnId) return;
      const targetId = parseInt(targetColumnId, 10);
      setAppState((prev) => ({
        ...prev,
        tasks: prev.tasks.map((task) =>
          task.isMarked ? { ...task, columnId: targetId, isMarked: false } : task
        ),
      }));
    },
    [setAppState]
  );

  const handleCreateOptionChange = useCallback(
    (value: CreateOption) => {
      setAppState((prev) => ({ ...prev, createOption: value }));
    },
    [setAppState]
  );

  // --- handle drag logic ---
  useEffect(() => {
    const cleanup = monitorForElements({
      onDragStart() {
        setIsDragging(true);
      },
      onDrop(payload) {
        setIsDragging(false);
        try {
          const source = payload.source ?? null;
          const location = payload.location ?? null;
          if (!source) return;

          const srcData = source.data ?? null;
          const dropTargets = location?.current?.dropTargets ?? [];
          const firstTarget = dropTargets[0] ?? null;
          const targetData = firstTarget?.data ?? null;

          setAppState((prev) =>
            handleDrop(
              prev,
              srcData as { type: string; id: number },
              targetData as { type: string; id?: number } | null
            )
          );
        } catch (err) {
          console.error('[dnd] onDrop error', err);
        }
      },
    });

    return () => cleanup?.();
  }, [setAppState]);

  const filterType = appState.filter;

  const tasksToShow = useMemo(() => {
    return appState.tasks.filter((task) => {
      if (filterType === 'completed' && !task.isCompleted) return false;
      if (filterType === 'incomplete' && task.isCompleted) return false;

      const query = searchValue.trim().toLowerCase();
      if (!query) return true;

      const text = task.text.toLowerCase();

      let lastIndex = -1;
      for (const char of query) {
        const index = text.indexOf(char, lastIndex + 1);
        if (index === -1) return false;
        lastIndex = index;
      }

      return true;
    });
  }, [appState.tasks, filterType, searchValue]);

  const unassignedTasks = useMemo(() => tasksToShow.filter((t) => !t.columnId), [tasksToShow]);
  const tasksWithColumn = useMemo(() => tasksToShow.filter((t) => !!t.columnId), [tasksToShow]);
  const isStateEmpty = useMemo(
    () => appState.columns.length === 0 && appState.tasks.length === 0,
    [appState.columns.length, appState.tasks.length]
  );
  const selectedTasks = useMemo(
    () => appState.tasks.filter((task) => task.isMarked),
    [appState.tasks]
  );

  const sortedUnassignedTasks = useMemo(() => sortByIndex(unassignedTasks), [unassignedTasks]);
  const sortedColumns = useMemo(() => sortByIndex(appState.columns), [appState.columns]);
  const sortedTasksWithColumn = useMemo(() => sortByIndex(tasksWithColumn), [tasksWithColumn]);

  return {
    appState,
    setAppState,
    isDragging,
    searchValue,
    setSearchValue,
    handleAddBtnClick,
    handleUpdateTask,
    handleDeleteColumn,
    handleDeleteTask,
    toggleColumnCheckmark,
    handleBulkDelete,
    handleBulkComplete,
    handleBulkIncomplete,
    handleBulkMove,
    handleCreateOptionChange,
    sortedUnassignedTasks,
    sortedColumns,
    sortedTasksWithColumn,
    selectedTasks,
    isStateEmpty,
  };
};
