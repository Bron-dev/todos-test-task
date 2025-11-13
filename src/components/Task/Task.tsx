import { useEffect, useRef, useState } from 'react';
import { draggable } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import { Input, Checkbox, RoundedContainer } from '@components';
import type { Task as TaskType } from '@types';

import styles from './Task.module.scss';

interface TaskProps {
  task: TaskType;
  onUpdate: (updatedTask: TaskType) => void;
}

export const Task = ({ task, onUpdate }: TaskProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState(task.text);
  const [isCompleted, setIsCompleted] = useState(task.isCompleted);

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsCompleted(e.target.checked);
    onUpdate({ ...task, isCompleted: e.target.checked });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleBlur = () => {
    if (text.trim() !== task.text) {
      onUpdate({ ...task, text: text.trim() });
    }
  };

  useEffect(() => {
    if (!ref.current) return;
    return draggable({
      element: ref.current,
      getInitialData: () => ({ type: 'task', id: task.id }), // мінімальний payload
    });
  }, [task.id]);

  return (
    <RoundedContainer ref={ref} className={styles.task}>
      <Input
        value={text}
        onChange={handleTextChange}
        onBlur={handleBlur}
        className={styles.task__input}
      />
      <Checkbox checked={isCompleted} onChange={handleCheckboxChange} />
    </RoundedContainer>
  );
};
