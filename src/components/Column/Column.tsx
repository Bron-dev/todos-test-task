import React, { useEffect, useRef } from 'react';
import {
  dropTargetForElements,
  draggable,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Checkbox } from '@components';
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

export const Column = ({
  columnId,
  title,
  children,
  isMarked,
  onColumnDelete,
  onCheckMarkToggle,
}: ColumnProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;

    const dropCleanup = dropTargetForElements({
      element: ref.current,
      getData: () => ({ type: 'column', id: columnId }),
    });

    const dragCleanup = draggable({
      element: ref.current,
      getInitialData: () => ({ type: 'column', id: columnId }),
    });

    return () => {
      dropCleanup?.();
      dragCleanup?.();
    };
  }, [columnId]);

  const hasTasks = React.Children.count(children) > 0;

  return (
    <div ref={ref} className={styles.column}>
      <div className={styles.column_header}>
        <Checkbox checked={isMarked} onChange={onCheckMarkToggle} />
        <h3 className={styles.column_header__title}>{title}</h3>
        <DeleteIcon
          className={styles.column_header__icon}
          onClick={() => onColumnDelete(columnId)}
        />
      </div>

      <div className={styles.column_children}>
        {hasTasks ? children : <p className={styles.column_children__noTasks}>No tasks yet</p>}
      </div>
    </div>
  );
};
