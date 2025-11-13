import React, { type Ref } from 'react';

import styles from './RoundedContainer.module.scss';

interface RoundedContainerProps {
  children: React.ReactNode;
  ref?: Ref<HTMLDivElement>;
  className?: string;
}

export const RoundedContainer = ({ children, ref, className }: RoundedContainerProps) => {
  return (
    <div className={`${className} ${styles.container}`} ref={ref}>
      {children}
    </div>
  );
};
