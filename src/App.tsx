import { useEffect } from 'react';
import { monitorForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import { Header, EmptyBox, CreateBox, TasksList, ColumnList } from '@components';
import { useLocalStorage } from '@hooks/useLocalStorage';
import { createColumn, createTask, moveTask, reorderColumn } from '@utils';
import type { AppState, Task } from '@types';
import { INITIAL_STATE } from '@constants';

import styles from './App.module.scss';

function App() {
  const [appState, setAppState] = useLocalStorage<AppState>('appState', INITIAL_STATE);

  // --- handle create ---
  const handleAddBtnClick = (type: 'column' | 'task', title: string) => {
    if (!title.trim()) return;

    if (type === 'column') {
      setAppState({
        ...appState,
        columns: [...appState.columns, createColumn(title, appState.columns.length)],
      });
    } else {
      setAppState({
        ...appState,
        tasks: [...appState.tasks, createTask(title)],
      });
    }
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setAppState((prev) => {
      const tasks = prev.tasks.map((t) => (t.id === updatedTask.id ? { ...t, ...updatedTask } : t));
      return { ...prev, tasks };
    });
  };

  // --- handle drag logic ---
  useEffect(() => {
    const cleanup = monitorForElements({
      onDrop(payload) {
        try {
          const source = (payload as any).source ?? (payload as any).drag ?? null;
          const location = (payload as any).location ?? null;
          if (!source) return;

          const srcData = source.data ?? source.payload ?? source.getData?.() ?? null;
          const dropTargets = location?.current?.dropTargets ?? [];
          const firstTarget = dropTargets[0] ?? null;
          const targetData = firstTarget?.data ?? firstTarget?.getData?.() ?? null;

          // --- TASK ---
          if (srcData?.type === 'task') {
            const taskId = Number(srcData.id);

            let newColumnId: number | undefined;
            let newIndex: number | undefined;

            if (targetData?.type === 'column') {
              newColumnId = Number(targetData.id);
              const tasksInColumn = appState.tasks
                .filter((t) => t.columnId === newColumnId)
                .sort((a, b) => (a.index ?? 0) - (b.index ?? 0));
              newIndex = tasksInColumn.length;
            } else if (targetData?.type === 'task') {
              const targetTask = appState.tasks.find((t) => t.id === Number(targetData.id));
              newColumnId = targetTask?.columnId;
              newIndex = targetTask?.index;
            }

            setAppState((prev) => moveTask(prev, taskId, newColumnId, newIndex));
            return;
          }

          // --- COLUMN ---
          if (srcData?.type === 'column' && targetData?.type === 'column') {
            const fromId = Number(srcData.id);
            const toId = Number(targetData.id);

            setAppState((prev) => reorderColumn(prev, fromId, toId));
            return;
          }
        } catch (err) {
          console.error('[dnd] onDrop error', err);
        }
      },
    });

    return () => cleanup?.();
  }, []);

  const unassignedTasks = appState.tasks.filter((t) => !t.columnId);
  const tasksWithColumn = appState.tasks.filter((t) => !!t.columnId);
  const isStateEmpty = appState.columns.length === 0 && appState.tasks.length === 0;

  return (
    <div className={styles.container}>
      <Header />
      <div className={styles.container__mainContent}>
        <CreateBox onAddBtnClick={handleAddBtnClick} />
        {isStateEmpty && <EmptyBox />}

        <TasksList
          onTaskUpdate={handleUpdateTask}
          tasks={unassignedTasks.sort((a, b) => (a.index ?? 0) - (b.index ?? 0))}
        />

        {!!appState.columns && (
          <ColumnList
            columns={appState.columns}
            tasks={tasksWithColumn.sort((a, b) => (a.index ?? 0) - (b.index ?? 0))}
            onTaskUpdate={handleUpdateTask}
          />
        )}
      </div>
    </div>
  );
}

export default App;
