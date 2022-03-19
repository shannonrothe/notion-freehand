import { useEffect, useState } from 'react';
import { Toolbar } from './components/toolbar';
import 'pollen-css';
import { Canvas, Path } from './components/canvas';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { action, runInAction } from 'mobx';
import './App.css';
import { v4 } from 'uuid';
import { Modal } from './components/modal';
import { toastful } from 'react-toastful';
import { styled } from '@stitches/react';

interface HistoryEntry {
  redo: () => void;
  undo: () => void;
}

type State = {
  color: string;
  dataUrl?: string;
  paths: Path[];
  history: HistoryEntry[];
  index: number;
  open: boolean;
  status: 'dirty' | 'saved';
};

const Success = styled('div', {
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--scale-00)',
});

const App = observer(() => {
  const snapshot = useLocalObservable<State>(() => ({
    color: 'color-black',
    dataUrl: '',
    paths: [],
    history: [],
    index: 0,
    open: false,
    status: 'saved',
  }));
  const [name, setName] = useState('');

  useEffect(() => {
    const _name = new URLSearchParams(window.location.search).get('name');
    if (_name) {
      setName(_name);
      try {
        const stored = localStorage.getItem(_name);
        if (!stored) {
          return;
        }
        const file = JSON.parse(stored);
        runInAction(() => {
          snapshot.color = file.color;
          snapshot.paths = file.paths;
        });
      } catch {
        // Unable to load file. Do nothing.
      }
    } else {
      const _name = v4();
      window.location.href = `${window.location.href}?name=${_name}`;
      setName(_name);
    }
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      console.log(snapshot.index);
      if (e.key === 'z' && e.metaKey && e.shiftKey) {
        if (snapshot.index + 1 < snapshot.history.length) {
          ++snapshot.index;
        }
        const entry = snapshot.history[snapshot.index];
        entry?.redo();
      } else if (e.key === 'z' && e.metaKey) {
        if (snapshot.index > 0) {
          --snapshot.index;
        }
        const entry = snapshot.history[snapshot.index];
        entry?.undo();
      }
    };

    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  });

  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      console.log(snapshot.status);
      if (snapshot.status === 'dirty') {
        const leave = confirm(
          'You have unsaved changes. Are you sure you want to leave?'
        );
        if (!leave) {
          e.preventDefault();
          e.returnValue = '';
        }
      }
    };

    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      window.addEventListener('beforeunload', onBeforeUnload);
    };
  });

  const handlePickColor = action((color: string) => (snapshot.color = color));
  const handleExport = async () => {
    if (name) {
      localStorage.setItem(name, JSON.stringify(snapshot));
      toastful.success(<Success>Changes saved</Success>, {
        position: 'bottom_right',
      });
      snapshot.status = 'saved';
      return;
    }
  };

  const handleAddPath = action((path: Path) => {
    const previousPaths = [...snapshot.paths];
    const nextPaths = [...snapshot.paths, path];

    snapshot.history = [
      ...snapshot.history,
      {
        redo: action(() => (snapshot.paths = nextPaths)),
        undo: action(() => (snapshot.paths = previousPaths)),
      },
    ];

    snapshot.paths = nextPaths;
    snapshot.index++;
    if (snapshot.status === 'saved') {
      snapshot.status = 'dirty';
    }
  });

  const handleSave = action(() => {
    if (name) {
      localStorage.setItem(name, JSON.stringify(snapshot));
      snapshot.status = 'saved';
    }
  });

  return (
    <>
      <Canvas
        paths={snapshot.paths}
        color={snapshot.color}
        onAddPath={handleAddPath}
      />
      <Toolbar
        color={snapshot.color}
        status={snapshot.status}
        onPickColor={handlePickColor}
        onExport={handleExport}
      />
      <Modal
        open={snapshot.open}
        onClose={action(() => (snapshot.open = false))}
        onConfirm={handleSave}
      />
    </>
  );
});

export default App;
