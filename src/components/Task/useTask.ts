import { useCallback, useEffect, useRef, useState } from 'react';
import type { Task as TaskType } from '@types';
import { useDraggableDropTarget } from '@hooks/useDraggableDropTarget';

interface UseTaskProps {
  task: TaskType;
  onUpdate: (updatedTask: TaskType) => void;
  onTaskDelete: (taskId: number) => void;
}

export const useTask = ({ task, onUpdate, onTaskDelete }: UseTaskProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [text, setText] = useState(task.text);
  const [isEditing, setIsEditing] = useState(false);

  useDraggableDropTarget(ref, 'task', task.id);

  useEffect(() => {
    if (!isEditing) setText(task.text);
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

  const handleEditClick = useCallback(() => setIsEditing(true), []);
  const handleDeleteClick = useCallback(() => onTaskDelete(task.id), [task.id, onTaskDelete]);

  return {
    ref,
    text,
    isEditing,
    toggleCheckbox,
    toggleSwitch,
    handleTextChange,
    handleBlur,
    handleEditClick,
    handleDeleteClick,
  };
};
