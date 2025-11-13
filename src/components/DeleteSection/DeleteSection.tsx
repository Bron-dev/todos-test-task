import { useEffect, useRef } from 'react';
import { dropTargetForElements } from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import DeleteIcon from '@icons/delete.svg?react';

import styles from './DeleteSection.module.scss';

interface DeleteSectionProps {
  isVisible: boolean;
}

export const DeleteSection = ({ isVisible }: DeleteSectionProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    return dropTargetForElements({
      element: ref.current,
      getData: () => {
        return { type: 'delete-zone' };
      },
    });
  }, []);

  return (
    <div ref={ref} className={`${styles.deleteSection} ${isVisible ? styles.show : ''}`}>
      <DeleteIcon className={styles.deleteSection_icon} />
      <p className={styles.deleteSection_text}>Drag tasks or columns here for deleting</p>
    </div>
  );
};
