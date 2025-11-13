import React, { memo, useCallback, useEffect, useRef, useState } from 'react';

import { Input, Checkbox, RoundedContainer, HighlightedText, Switch } from '@components';
import type { Task as TaskType } from '@types';
import DeleteIcon from '@icons/delete.svg?react';
import EditIcon from '@icons/edit.svg?react';
import { useDraggableDropTarget } from '@hooks/useDraggableDropTarget.ts';

import styles from './Task.module.scss';

interface TaskProps {
  task: TaskType;
  onUpdate: (updatedTask: TaskType) => void;
  onTaskDelete: (taskId: number) => void;
  searchValue: string;
}

export const Task = memo(({ task, onUpdate, onTaskDelete, searchValue }: TaskProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState(task.text);
  const [isEditing, setIsEditing] = useState(false);
  useDraggableDropTarget(ref, 'task', task.id);

  useEffect(() => {
    if (!isEditing) {
      setText(task.text);
    }
  }, [task.text, isEditing]);

  const toggleCheckbox = useCallback(() => {
    onUpdate({ ...task, isMarked: !task.isMarked });
  }, [task, onUpdate]);

  const toggleSwitch = useCallback(() => {
    onUpdate({ ...task, isCompleted: !task.isCompleted });
  }, [task, onUpdate]);

  const handleTextChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setText(e.target.value);
  }, []);

  const handleBlur = useCallback(() => {
    setIsEditing(false);
    if (text.trim() !== task.text) {
      onUpdate({ ...task, text: text.trim() });
    }
  }, [text, task, onUpdate]);

  const handleEditClick = useCallback(() => {
    setIsEditing(true);
  }, []);

  const handleDeleteClick = useCallback(() => {
    onTaskDelete(task.id);
  }, [task.id, onTaskDelete]);

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
        <EditIcon onClick={handleEditClick} className={styles.task_cta__edit} />
        <DeleteIcon onClick={handleDeleteClick} className={styles.task_cta__icon} />
      </div>
    </RoundedContainer>
  );
});
