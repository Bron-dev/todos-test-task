import { memo } from 'react';
import { Button, OptionSelector, Input, RoundedContainer } from '@components';
import type { CreateOption } from '@types';
import { CREATE_OPTIONS } from '@constants';
import { useCreateBox } from './useCreateBox.ts';

import styles from './CreateBox.module.scss';

interface CreateBoxProps {
  creationType: CreateOption; // поточний тип
  onAddBtnClick: (type: CreateOption, title: string) => void;
  onSelect: (type: CreateOption) => void; // зміна типу
}

export const CreateBox = memo(({ creationType, onAddBtnClick, onSelect }: CreateBoxProps) => {
  const { title, handleTitleChange, handleKeyDown, handleAddClick } = useCreateBox({
    creationType,
    onAddBtnClick,
  });

  return (
    <RoundedContainer>
      <div className={styles.boxContainer}>
        <Input
          value={title}
          onChange={handleTitleChange}
          placeholder={`Enter ${creationType}'s title`}
          onKeyDown={handleKeyDown}
        />
        <OptionSelector options={CREATE_OPTIONS} value={creationType} onSelect={onSelect} />
      </div>
      <Button onClick={handleAddClick} className={styles.addBtn}>
        Create
      </Button>
    </RoundedContainer>
  );
});
