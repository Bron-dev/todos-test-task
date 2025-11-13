import { useEffect, useState } from 'react';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import {
  Header,
  EmptyBox,
  CreateBox,
  TasksList,
  ColumnList,
  DeleteSection,
  SearchBox,
  BulkActionSidebar,
} from '@components';
import { useLocalStorage } from '@hooks/useLocalStorage';
import { createColumn, createTask, deleteColumn, deleteTask } from '@utils';
import { handleDrop } from '@utils/dragAndDrop.ts';
import type { AppState, CreateOption, Task } from '@types';
import { INITIAL_STATE } from '@constants';

import styles from './App.module.scss';

function App() {
  const [appState, setAppState] = useLocalStorage<AppState>('appState', INITIAL_STATE);
  const [isDragging, setIsDragging] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const handleAddBtnClick = (type: CreateOption, title: string) => {
    if (!title.trim()) return;

    if (type === 'column') {
      setAppState({
        ...appState,
        columns: [...appState.columns, createColumn(title, appState.columns.length)],
      });
    } else {
      setAppState({
        ...appState,
        tasks: [...appState.tasks, createTask(title, appState.tasks.length)],
      });
    }
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setAppState((prev) => {
      const tasks = prev.tasks.map((t) => (t.id === updatedTask.id ? { ...t, ...updatedTask } : t));
      return { ...prev, tasks };
    });
  };

  const handleDeleteColumn = (columnId: number) => {
    setAppState((prev) => deleteColumn(prev, columnId));
  };

  const handleDeleteTask = (taskId: number) => {
    setAppState((prev) => deleteTask(prev, taskId));
  };

  const toggleColumnCheckmark = (columnId: number) => {
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
  };

  const handleBulkDelete = () => {
    setAppState((prev) => ({
      ...prev,
      tasks: prev.tasks.filter((task) => !task.isMarked),
    }));
  };

  const handleBulkComplete = () => {
    setAppState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.isMarked ? { ...task, isCompleted: true, isMarked: false } : task
      ),
    }));
  };

  const handleBulkIncomplete = () => {
    setAppState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.isMarked ? { ...task, isCompleted: false, isMarked: false } : task
      ),
    }));
  };

  const handleBulkMove = (targetColumnId: string) => {
    if (!targetColumnId) return;
    const targetId = parseInt(targetColumnId, 10);
    setAppState((prev) => ({
      ...prev,
      tasks: prev.tasks.map((task) =>
        task.isMarked ? { ...task, columnId: targetId, isMarked: false } : task
      ),
    }));
  };

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
  }, []);

  const filterType = appState.filter;

  const tasksToShow = appState.tasks.filter((task) => {
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

  const unassignedTasks = tasksToShow.filter((t) => !t.columnId);
  const tasksWithColumn = tasksToShow.filter((t) => !!t.columnId);
  const isStateEmpty = appState.columns.length === 0 && appState.tasks.length === 0;
  const selectedTasks = appState.tasks.filter((task) => task.isMarked);

  return (
    <div className={styles.container}>
      <Header />

      <BulkActionSidebar
        selectedCount={selectedTasks.length}
        onDelete={handleBulkDelete}
        onMarkComplete={handleBulkComplete}
        onMarkIncomplete={handleBulkIncomplete}
        onMove={handleBulkMove}
        columns={appState.columns}
      />

      <div className={styles.container__mainContent}>
        <div className={styles.actionBoxes}>
          <CreateBox
            creationType={appState.createOption}
            onAddBtnClick={handleAddBtnClick}
            onSelect={(value) => setAppState((prev) => ({ ...prev, createOption: value }))}
          />

          <SearchBox
            setAppState={setAppState}
            filterValue={appState.filter}
            searchValue={searchValue}
            setSearchValue={setSearchValue}
          />
        </div>

        {isStateEmpty && <EmptyBox />}

        {!isStateEmpty && (
          <>
            <TasksList
              tasks={unassignedTasks.sort((a, b) => (a.index ?? 0) - (b.index ?? 0))}
              onTaskUpdate={handleUpdateTask}
              onTaskDelete={handleDeleteTask}
              searchValue={searchValue}
            />
          </>
        )}

        {!!appState.columns && (
          <ColumnList
            columns={appState.columns.sort((a, b) => (a.index ?? 0) - (b.index ?? 0))}
            tasks={tasksWithColumn.sort((a, b) => (a.index ?? 0) - (b.index ?? 0))}
            onTaskUpdate={handleUpdateTask}
            onColumnDelete={handleDeleteColumn}
            onTaskDelete={handleDeleteTask}
            onCheckMarkToggle={toggleColumnCheckmark}
            searchValue={searchValue}
          />
        )}

        <DeleteSection isVisible={isDragging} />
      </div>
    </div>
  );
}

export default App;
