import React, { useEffect, useRef, useState } from 'react';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import { Input, Checkbox, RoundedContainer, HighlightedText, Switch } from '@components';
import type { Task as TaskType } from '@types';
import DeleteIcon from '@icons/delete.svg?react';
import EditIcon from '@icons/edit.svg?react';

import styles from './Task.module.scss';

interface TaskProps {
  task: TaskType;
  onUpdate: (updatedTask: TaskType) => void;
  onTaskDelete: (taskId: number) => void;
  searchValue: string;
}

export const Task = ({ task, onUpdate, onTaskDelete, searchValue }: TaskProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState(task.text);
  const [isEditing, setIsEditing] = useState(false);

  const toggleCheckbox = () => {
    onUpdate({ ...task, isMarked: !task.isMarked });
  };

  const toggleSwitch = () => {
    onUpdate({ ...task, isCompleted: !task.isCompleted });
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (text.trim() !== task.text) {
      onUpdate({ ...task, text: text.trim() });
    }
  };

  useEffect(() => {
    if (!ref.current) return;

    const dropCleanup = dropTargetForElements({
      element: ref.current,
      getData: () => ({ type: 'task', id: task.id }),
    });

    const dragCleanup = draggable({
      element: ref.current,
      getInitialData: () => ({ type: 'task', id: task.id }),
    });

    return () => {
      dropCleanup?.();
      dragCleanup?.();
    };
  }, [task.id]);

  return (
    <RoundedContainer ref={ref} className={styles.task}>
      <Checkbox checked={task.isMarked} onChange={toggleCheckbox} />

      {isEditing ? (
        <Input
          value={text}
          onChange={handleTextChange}
          onBlur={handleBlur}
          autoFocus
          className={styles.task_input}
        />
      ) : (
        <div className={`${styles.task_text} ${task.isCompleted ? styles.completed : ''}`}>
          <HighlightedText text={task.text} highlight={searchValue} />
        </div>
      )}

      <div className={styles.task_cta}>
        <Switch checked={task.isCompleted} onChange={toggleSwitch} tooltip="Mark as done" />
        <EditIcon onClick={() => setIsEditing(true)} className={styles.task_cta__edit} />
        <DeleteIcon onClick={() => onTaskDelete(task.id)} className={styles.task_cta__icon} />
      </div>
    </RoundedContainer>
  );
};
