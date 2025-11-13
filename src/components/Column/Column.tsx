import React, { useEffect, useRef } from 'react';
import {
  dropTargetForElements,
  draggable,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Checkbox } from '@components';

import styles from './Column.module.scss';

interface ColumnProps {
  columnId: number;
  title: string;
  children?: React.ReactNode;
  isChosen: boolean;
}

export const Column = ({ columnId, title, children, isChosen }: ColumnProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    return dropTargetForElements({
      element: ref.current,
      getData: () => {
        return { type: 'column', id: columnId };
      },
    });
  }, [columnId]);

  useEffect(() => {
    if (!handleRef.current) return;
    return draggable({
      element: handleRef.current,
      getInitialData: () => ({ type: 'column', id: columnId }),
    });
  }, [columnId]);

  const hasTasks = React.Children.count(children) > 0;

  return (
    <div ref={ref} className={styles.column}>
      <div className={styles.column_header}>
        <Checkbox checked={isChosen} onChange={() => console.log(columnId)} />
        <h3 ref={handleRef}>{title}</h3>
      </div>

      <div className={styles.column_children}>
        {hasTasks ? children : <p className={styles.column_children__noTasks}>No tasks yet</p>}
      </div>
    </div>
  );
};
