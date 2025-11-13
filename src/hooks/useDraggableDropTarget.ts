import { useEffect } from 'react';
import type { RefObject } from 'react';
import {
  draggable,
  dropTargetForElements,
} from '@atlaskit/pragmatic-drag-and-drop/element/adapter';

import type { DragItemType } from '@types';

interface Options {
  draggable?: boolean;
  droppable?: boolean;
}

export const useDraggableDropTarget = <T extends HTMLElement = HTMLElement>(
  ref: RefObject<T | null>,
  type: DragItemType,
  id?: number,
  options: Options = { draggable: true, droppable: true }
) => {
  useEffect(() => {
    if (!ref.current) return; // safe null check

    let dragCleanup: (() => void) | undefined;
    let dropCleanup: (() => void) | undefined;

    if (options.droppable) {
      dropCleanup = dropTargetForElements({
        element: ref.current,
        getData: () => ({ type, id }),
      });
    }

    if (options.draggable) {
      dragCleanup = draggable({
        element: ref.current,
        getInitialData: () => ({ type, id }),
      });
    }

    return () => {
      dropCleanup?.();
      dragCleanup?.();
    };
  }, [ref, type, id, options.draggable, options.droppable]);
};
