import { Task } from '@components';
import type { Task as TaskType } from '@types';

import styles from './TasksList.module.scss';

interface Props {
  tasks: TaskType[];
  onTaskUpdate: (task: TaskType) => void;
}

export const TasksList = ({ tasks, onTaskUpdate }: Props) => {
  return (
    <div className={styles.list}>
      <h3>Unassigned Tasks</h3>
      {!!tasks.length && (
        <ul className={styles.list_tasks}>
          {tasks.map((t) => (
            <li key={t.id}>
              <Task task={t} onUpdate={onTaskUpdate} />
            </li>
          ))}
        </ul>
      )}
      {!tasks.length && (
        <p>
          No unassigned tasks found, create by adding task in the top, or dragging task over here
        </p>
      )}
    </div>
  );
};
