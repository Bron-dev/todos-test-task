import React, { useState } from 'react';
import { Button, OptionSelector, Input, RoundedContainer } from '@components';
import type { CreateOption } from '@types';
import { CREATE_OPTIONS } from '@constants';

import styles from './CreateBox.module.scss';

interface CreateBoxProps {
  creationType: CreateOption; // поточний тип
  onAddBtnClick: (type: CreateOption, title: string) => void;
  onSelect: (type: CreateOption) => void; // зміна типу
}

export const CreateBox = ({ creationType, onAddBtnClick, onSelect }: CreateBoxProps) => {
  const [title, setTitle] = useState('');

  const handleAddClick = () => {
    if (!title.trim()) return;
    onAddBtnClick(creationType, title);
    setTitle('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddClick();
    }
  };

  return (
    <RoundedContainer>
      <div className={styles.boxContainer}>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={`Enter ${creationType}'s title`}
          onKeyDown={handleKeyDown}
        />
        <OptionSelector<CreateOption>
          options={CREATE_OPTIONS}
          value={creationType}
          onSelect={onSelect}
        />
      </div>
      <Button onClick={handleAddClick} className={styles.addBtn}>
        Create
      </Button>
    </RoundedContainer>
  );
};
