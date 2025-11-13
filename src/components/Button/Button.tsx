import React from 'react';
import styles from './Button.module.scss';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: 'small' | 'medium' | 'large';
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  size = 'medium',
  children,
  className = '',
  ...props
}) => {
  return (
    <button className={`${styles.btn} ${styles[size]} ${className}`} {...props}>
      {children}
    </button>
  );
};
