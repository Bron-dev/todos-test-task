import { Column, Task } from '@components';
import type { Column as ColumnType, Task as TaskType } from '@types';

import styles from './ColumnList.module.scss';

interface ColumnListProps {
  columns: ColumnType[];
  tasks: TaskType[];
}

export const ColumnList = ({ columns, tasks }: ColumnListProps) => {
  return (
    <div className={styles.list}>
      {columns.map((column) => {
        const columnTasks = tasks.filter((t) => t.columnId === column.id);
        return (
          <Column key={column.id} columnId={column.id} title={column.title}>
            {columnTasks.map((task) => (
              <Task key={task.id} {...task} />
            ))}
          </Column>
        );
      })}
    </div>
  );
};
