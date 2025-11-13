import { useRef } from 'react';
import { useDraggableDropTarget } from '@hooks/useDraggableDropTarget.ts';

import DeleteIcon from '@icons/delete.svg?react';

import styles from './DeleteSection.module.scss';

interface DeleteSectionProps {
  isVisible: boolean;
}

export const DeleteSection = ({ isVisible }: DeleteSectionProps) => {
  const ref = useRef<HTMLDivElement | null>(null);
  useDraggableDropTarget(ref, 'delete-zone', undefined, { draggable: false, droppable: true });

  return (
    <div ref={ref} className={`${styles.deleteSection} ${isVisible ? styles.show : ''}`}>
      <DeleteIcon className={styles.deleteSection_icon} />
      <p className={styles.deleteSection_text}>Drag tasks or columns here for deleting</p>
    </div>
  );
};
