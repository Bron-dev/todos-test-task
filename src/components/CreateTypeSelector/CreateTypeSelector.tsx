import { useState } from 'react';

import type { CreateOption } from '@types';

import styles from './CreateTypeSelector.module.scss';

interface CreateTypeSelectorProps {
  onSelect: (type: CreateOption) => void;
  defaultValue?: CreateOption;
}

export const CreateTypeSelector = ({
  onSelect,
  defaultValue = 'column',
}: CreateTypeSelectorProps) => {
  const [selected, setSelected] = useState<CreateOption>(defaultValue);

  const handleSelect = (type: CreateOption) => {
    setSelected(type);
    onSelect(type);
  };

  return (
    <div className={styles.wrapper}>
      <button
        className={`${styles.option} ${selected === 'column' ? styles.active : ''}`}
        onClick={() => handleSelect('column')}
      >
        Column
      </button>
      <button
        className={`${styles.option} ${selected === 'task' ? styles.active : ''}`}
        onClick={() => handleSelect('task')}
      >
        Task
      </button>
    </div>
  );
};
