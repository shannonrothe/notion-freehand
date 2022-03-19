import { action } from 'mobx';
import { useEffect } from 'react';
import { HistoryEntry, Path, State, Status } from '../types';

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

  const next = action((history: HistoryEntry[], nextPaths: Path[]) => {
    store.history = history;
    store.paths = nextPaths;
    store.index++;
  });

  const record = action((path: Path) => {
    const previousPaths = [...store.paths];
    const nextPaths = [...store.paths, path];

    next(
      [
        ...store.history,
        {
          redo: action(() => (store.paths = nextPaths)),
          undo: action(() => {
            store.status = Status.DIRTY;
            store.paths = previousPaths;
          }),
        },
      ],
      nextPaths
    );
    if (store.status === Status.SAVED) {
      store.status = Status.DIRTY;
    }
  });

  return { record };
};
