import { Column, Task } from '@components';
import type { Column as ColumnType, Task as TaskType } from '@types';

import styles from './ColumnList.module.scss';

interface ColumnListProps {
  columns: ColumnType[];
  tasks: TaskType[];
  onTaskUpdate: (updatedTask: TaskType) => void;
  onColumnDelete: (columnId: number) => void;
  onTaskDelete: (taskId: number) => void;
  onCheckMarkToggle: (columnId: number) => void;
  searchValue: string;
}

export const ColumnList = ({
  columns,
  tasks,
  onTaskUpdate,
  onColumnDelete,
  onTaskDelete,
  onCheckMarkToggle,
  searchValue,
}: ColumnListProps) => {
  return (
    <ul className={styles.list}>
      {columns.map((column) => {
        const columnTasks = tasks.filter((t) => t.columnId === column.id);
        return (
          <li key={column.id}>
            <Column
              columnId={column.id}
              title={column.title}
              isMarked={column.isMarked}
              onColumnDelete={onColumnDelete}
              onCheckMarkToggle={() => onCheckMarkToggle(column.id)}
            >
              {columnTasks.map((task) => (
                <Task
                  key={task.id}
                  task={task}
                  onUpdate={onTaskUpdate}
                  onTaskDelete={onTaskDelete}
                  searchValue={searchValue}
                />
              ))}
            </Column>
          </li>
        );
      })}
    </ul>
  );
};
