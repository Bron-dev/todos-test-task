import { useEffect, useRef } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Task } from '@components';
import type { Task as TaskType } from '@types';

import styles from './TasksList.module.scss';

interface Props {
  tasks: TaskType[];
  onTaskUpdate: (task: TaskType) => void;
  onTaskDelete: (taskId: number) => void;
  searchValue: string;
}

export const TasksList = ({ tasks, onTaskUpdate, onTaskDelete, searchValue }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    return dropTargetForElements({
      element: ref.current,
      getData: () => {
        return { type: 'tasks-list' };
      },
    });
  }, []);

  return (
    <div className={styles.list} ref={ref}>
      <h3>Unassigned Tasks</h3>

      {!!tasks.length && (
        <ul className={styles.list_tasks}>
          {tasks.map((t) => (
            <li key={t.id}>
              <Task
                task={t}
                onUpdate={onTaskUpdate}
                onTaskDelete={onTaskDelete}
                searchValue={searchValue}
              />
            </li>
          ))}
        </ul>
      )}

      {!tasks.length && (
        <p>No unassigned tasks found, create by adding task on top, or dragging task over here</p>
      )}
    </div>
  );
};
