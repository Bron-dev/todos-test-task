import React from 'react';
import styles from './Checkbox.module.scss';

export const Checkbox = ({
  className = '',
  ...props
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <label className={`${styles['checkbox-wrapper']} ${className}`}>
      <input type="checkbox" className={styles['checkbox-input']} {...props} />
      <span className={styles['checkbox-box']}></span>
    </label>
  );
};
