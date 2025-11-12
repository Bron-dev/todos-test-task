import React, { useEffect, useRef } from 'react';
import {
  dropTargetForElements,
  draggable,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import styles from './Column.module.scss';

interface Props {
  columnId: number;
  title: string;
  children?: React.ReactNode;
}

export const Column = ({ columnId, title, children }: Props) => {
  const ref = useRef<HTMLDivElement | null>(null);
  const handleRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    return dropTargetForElements({
      element: ref.current,
      getData: () => {
        console.log('[dnd] column registered as drop target', columnId);
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

  return (
    <div ref={ref} className={styles.column}>
      <div ref={handleRef} className={styles.header}>
        {title}
      </div>
      {children}
    </div>
  );
};
