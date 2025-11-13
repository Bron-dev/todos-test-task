import React, { useCallback, useMemo, useRef } from 'react';
import { useDraggableDropTarget } from '@hooks/useDraggableDropTarget.ts';

interface UseColumnProps {
  columnId: number;
  children?: React.ReactNode;
  onColumnDelete: (columnId: number) => void;
}

export const useColumn = ({ columnId, children, onColumnDelete }: UseColumnProps) => {
  const ref = useRef<HTMLDivElement | null>(null);

  useDraggableDropTarget(ref, 'column', columnId);

  const hasTasks = useMemo(() => React.Children.count(children) > 0, [children]);

  const handleDeleteClick = useCallback(() => {
    onColumnDelete(columnId);
  }, [columnId, onColumnDelete]);

  return { ref, hasTasks, handleDeleteClick };
};
