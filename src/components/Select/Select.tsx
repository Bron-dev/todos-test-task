import { useState, useRef, useEffect } from 'react';

import styles from './Select.module.scss';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  options: Option[];
  placeholder?: string;
  onSelect: (value: string) => void;
  className?: string;
}

export const Select = ({
  options,
  placeholder = 'Select...',
  onSelect,
  className = '',
}: SelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<Option | null>(null);
  const ref = useRef<HTMLDivElement>(null);

  const handleSelect = (option: Option) => {
    setSelected(option);
    onSelect(option.value);
    setIsOpen(false);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className={`${styles.selectContainer} ${className}`}>
      <button className={`${styles.selectButton}`} onClick={() => setIsOpen((prev) => !prev)}>
        {selected ? selected.label : placeholder}
        <span className={`${styles.arrow} ${isOpen ? styles.open : ''}`}>▾</span>
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {options.map((option) => (
            <div
              key={option.value}
              className={`${styles.option} ${
                selected?.value === option.value ? styles.active : ''
              }`}
              onClick={() => handleSelect(option)}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
