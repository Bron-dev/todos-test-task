import React, { memo, useCallback, useMemo, useRef } from 'react';
import { Checkbox } from '@components';
import { useDraggableDropTarget } from '@hooks/useDraggableDropTarget.ts';
import DeleteIcon from '@icons/delete.svg?react';

import styles from './Column.module.scss';

interface ColumnProps {
  columnId: number;
  title: string;
  children?: React.ReactNode;
  isMarked: boolean;
  onColumnDelete: (columnId: number) => void;
  onCheckMarkToggle: () => void;
}

export const Column = memo(({
  columnId,
  title,
  children,
  isMarked,
  onColumnDelete,
  onCheckMarkToggle,
}: ColumnProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  useDraggableDropTarget(ref, 'column', columnId);

  const hasTasks = useMemo(() => React.Children.count(children) > 0, [children]);

  const handleDeleteClick = useCallback(() => {
    onColumnDelete(columnId);
  }, [columnId, onColumnDelete]);

  return (
    <div ref={ref} className={styles.column}>
      <div className={styles.column_header}>
        <Checkbox checked={isMarked} onChange={onCheckMarkToggle} />
        <h3 className={styles.column_header__title}>{title}</h3>
        <DeleteIcon
          className={styles.column_header__icon}
          onClick={handleDeleteClick}
        />
      </div>

      <div className={styles.column_children}>
        {hasTasks ? children : <p className={styles.column_children__noTasks}>No tasks yet</p>}
      </div>
    </div>
  );
});
