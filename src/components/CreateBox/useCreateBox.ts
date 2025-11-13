import React, { useCallback, useState } from 'react';
import type { CreateOption } from '@types';

interface UseCreateBoxProps {
  creationType: CreateOption;
  onAddBtnClick: (type: CreateOption, title: string) => void;
}

export const useCreateBox = ({ creationType, onAddBtnClick }: UseCreateBoxProps) => {
  const [title, setTitle] = useState('');

  const handleAddClick = useCallback(() => {
    if (!title.trim()) return;
    onAddBtnClick(creationType, title);
    setTitle('');
  }, [title, creationType, onAddBtnClick]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddClick();
      }
    },
    [handleAddClick]
  );

  const handleTitleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
  }, []);

  return { title, handleTitleChange, handleKeyDown, handleAddClick };
};
