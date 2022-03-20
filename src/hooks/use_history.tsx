import { action } from 'mobx';
import { useEffect } from 'react';
import {
  HistoryEntry,
  Path,
  Point,
  State,
  Status,
  WithColor,
  WithDimensions,
} from '../types';

export const useHistory = (store: State) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'z' && e.metaKey && e.shiftKey) {
        if (store.index + 1 < store.history.length) {
          ++store.index;
        }
        const entry = store.history[store.index];
        entry?.redo();
      } else if (e.key === 'z' && e.metaKey) {
        if (store.index > 0) {
          --store.index;
        }
        const entry = store.history[store.index];
        entry?.undo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  const next = action(
    (
      history: HistoryEntry[],
      nextPoints: WithColor<{ id: string; points: WithDimensions<Point>[] }>[]
    ) => {
      store.history = history;
      store.committedPoints = nextPoints;
      store.index++;
    }
  );

  const record = action(
    (commit: WithColor<{ id: string; points: WithDimensions<Point>[] }>) => {
      const previousPoints = [...store.committedPoints];
      const nextPoints = [...store.committedPoints, commit];

      next(
        [
          ...store.history,
          {
            redo: action(() => (store.committedPoints = nextPoints)),
            undo: action(() => {
              store.status = Status.DIRTY;
              store.committedPoints = previousPoints;
            }),
          },
        ],
        nextPoints
      );
      if (store.status === Status.SAVED) {
        store.status = Status.DIRTY;
      }
    }
  );

  return { record };
};
