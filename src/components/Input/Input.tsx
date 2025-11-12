import React from 'react';
import styles from './Input.module.scss';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: 'small' | 'medium' | 'large';
  error?: boolean;
}

export const Input: React.FC<InputProps> = ({
  size = 'medium',
  error = false,
  className = '',
  ...props
}) => {
  return (
    <input
      className={`${styles.input} ${styles[size]} ${error ? styles.error : ''} ${className}`}
      {...props}
    />
  );
};
