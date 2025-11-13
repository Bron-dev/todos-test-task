import { useMemo, memo } from 'react';
import { Button, Select } from '@components';

import styles from './BulkActionSidebar.module.scss';

interface BulkActionSidebarProps {
  selectedCount: number;
  onDelete: () => void;
  onMarkComplete: () => void;
  onMarkIncomplete: () => void;
  onMove: (columnId: string) => void;
  columns: { id: number; title: string }[];
}

export const BulkActionSidebar = memo(
  ({
    selectedCount,
    onDelete,
    onMarkComplete,
    onMarkIncomplete,
    onMove,
    columns,
  }: BulkActionSidebarProps) => {
    const columnOptions = useMemo(
      () =>
        columns.map((col) => ({
          label: col.title,
          value: col.id.toString(),
        })),
      [columns]
    );

    if (selectedCount === 0) return null;

    return (
      <div className={styles.sidebar}>
        <h3 className={styles.title}>{selectedCount} selected</h3>

        <div className={styles.actions}>
          <Button className={`${styles.actionBtn} ${styles.delete}`} onClick={onDelete}>
            🗑️
          </Button>
          <Button className={`${styles.actionBtn} ${styles.complete}`} onClick={onMarkComplete}>
            ✅
          </Button>
          <Button className={`${styles.actionBtn} ${styles.incomplete}`} onClick={onMarkIncomplete}>
            🔁
          </Button>
        </div>

        <div className={styles.moveSection}>
          <Select
            className={styles.sidebarSelect}
            placeholder="Move to..."
            options={columnOptions}
            onSelect={onMove}
          />
        </div>
      </div>
    );
  }
);
