import { memo } from 'react';

import { Input, Checkbox, RoundedContainer, HighlightedText, Switch } from '@components';
import type { Task as TaskType } from '@types';
import DeleteIcon from '@icons/delete.svg?react';
import EditIcon from '@icons/edit.svg?react';
import { useTask } from './useTask.ts';

import styles from './Task.module.scss';

interface TaskProps {
  task: TaskType;
  onUpdate: (updatedTask: TaskType) => void;
  onTaskDelete: (taskId: number) => void;
  searchValue: string;
}

export const Task = memo(({ task, onUpdate, onTaskDelete, searchValue }: TaskProps) => {
  const {
    ref,
    text,
    isEditing,
    toggleCheckbox,
    toggleSwitch,
    handleTextChange,
    handleBlur,
    handleEditClick,
    handleDeleteClick,
  } = useTask({ task, onUpdate, onTaskDelete });

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
