import { useEffect, useRef } from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';
import { Input, Checkbox } from '@components';

import styles from './Task.module.scss';

interface TaskProps {
  id: number;
  text: string;
  isCompleted: boolean;
}

export const Task = ({ id, text, isCompleted }: TaskProps) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    return draggable({
      element: ref.current,
      getInitialData: () => ({ type: 'task', id }), // мінімальний payload
    });
  }, [id]);

  return (
    <div ref={ref} className={styles.task}>
      <Input value={text} />
      <Checkbox checked={isCompleted} onChange={() => {}} />
    </div>
  );
};
