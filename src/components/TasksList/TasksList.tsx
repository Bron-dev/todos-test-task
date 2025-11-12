import { useRef } from 'react';

import { Task } from '@components';
import type { Task as TaskType } from '@types';

import styles from './TasksList.module.scss';

interface Props {
  tasks: TaskType[];
}

export const TasksList = ({ tasks }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);

  return (
    <div ref={ref} className={styles.list}>
      <h3>Unassigned Tasks</h3>
      <ul>
        {tasks.map((t) => (
          <li key={t.id}>
            <Task id={t.id} text={t.text} isCompleted={t.isCompleted} />
          </li>
        ))}
      </ul>
    </div>
  );
};
