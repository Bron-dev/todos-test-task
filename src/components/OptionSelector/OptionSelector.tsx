import { useState } from 'react';
import type { Option } from '@types';

import styles from './OptionSelector.module.scss';

interface OptionSelectorProps<T> {
  options: Option<T>[];
  onSelect: (value: T) => void;
  value?: T;
}

export const OptionSelector = <T extends string>({
  options,
  onSelect,
  value,
}: OptionSelectorProps<T>) => {
  const [selected, setSelected] = useState<T>(value ?? options[0].value);

  const handleSelect = (value: T) => {
    setSelected(value);
    onSelect(value);
  };

  return (
    <div className={styles.wrapper}>
      {options.map((option) => (
        <button
          key={option.value}
          className={`${styles.option} ${selected === option.value ? styles.active : ''}`}
          onClick={() => handleSelect(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};
