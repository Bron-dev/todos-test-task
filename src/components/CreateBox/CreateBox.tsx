import { useState } from 'react';
import { Button, CreateTypeSelector, Input, RoundedContainer } from '@components';
import type { CreateOption } from '@types';

import styles from './CreateBox.module.scss';

interface CreateBoxProps {
  onAddBtnClick: (type: CreateOption, title: string) => void;
}

export const CreateBox = ({ onAddBtnClick }: CreateBoxProps) => {
  const [type, setType] = useState<CreateOption>('column');
  const [title, setTitle] = useState('');

  const handleAddClick = () => {
    onAddBtnClick(type, title);
    setTitle('');
  };

  return (
    <RoundedContainer>
      <div className={styles.boxContainer}>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={`Enter ${type} name`}
        />
        <CreateTypeSelector onSelect={setType} defaultValue={type} />
        <Button onClick={handleAddClick}>Add</Button>
      </div>
    </RoundedContainer>
  );
};
