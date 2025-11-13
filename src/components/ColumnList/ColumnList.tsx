import { useMemo } from 'react';
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
  const tasksByColumn = useMemo(() => {
    const map = new Map<number, TaskType[]>();
    tasks.forEach((task) => {
      if (task.columnId) {
        const existing = map.get(task.columnId) || [];
        map.set(task.columnId, [...existing, task]);
      }
    });
    return map;
  }, [tasks]);

  return (
    <ul className={styles.list}>
      {columns.map((column) => {
        const columnTasks = tasksByColumn.get(column.id) || [];
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
