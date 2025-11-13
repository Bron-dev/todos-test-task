import { Column, Task } from '@components';
import type { Column as ColumnType, Task as TaskType } from '@types';

import styles from './ColumnList.module.scss';

interface ColumnListProps {
  columns: ColumnType[];
  tasks: TaskType[];
  onTaskUpdate: (updatedTask: TaskType) => void;
}

export const ColumnList = ({ columns, tasks, onTaskUpdate }: ColumnListProps) => {
  return (
    <ul className={styles.list}>
      {columns.map((column) => {
        const columnTasks = tasks.filter((t) => t.columnId === column.id);
        return (
          <li key={column.id}>
            <Column columnId={column.id} title={column.title} isChosen={column.isChosen}>
              {columnTasks.map((task) => (
                <Task key={task.id} task={task} onUpdate={onTaskUpdate} />
              ))}
            </Column>
          </li>
        );
      })}
    </ul>
  );
};
