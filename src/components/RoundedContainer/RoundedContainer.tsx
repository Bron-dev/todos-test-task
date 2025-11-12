import React from 'react';

import styles from './RoundedContainer.module.scss';

interface RoundedContainerProps {
  children: React.ReactNode;
}

export const RoundedContainer = ({ children }: RoundedContainerProps) => {
  return <div className={styles.container}>{children}</div>;
};
