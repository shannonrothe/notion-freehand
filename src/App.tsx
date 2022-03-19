import { useEffect, useState } from 'react';
import { Toolbar } from './components/toolbar';
import 'pollen-css';
import { Canvas, Path } from './components/canvas';
import { Canvg, presets } from 'canvg';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { action } from 'mobx';
import './App.css';
import { v4 } from 'uuid';

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
};

const App = observer(() => {
  const snapshot = useLocalObservable<State>(() => ({
    color: 'color-black',
    dataUrl: '',
    paths: [],
    history: [],
    index: 0,
  }));
  const [svgRef, setSvgRef] = useState<SVGSVGElement | null>(null);
  const [uuid] = useState(() => v4());

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

  const handlePickColor = action((color: string) => (snapshot.color = color));
  const handleExport = async () => {
    if (!svgRef) {
      return;
    }

    const { width, height } = svgRef.getBoundingClientRect();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const v = await Canvg.from(ctx, svgRef.outerHTML, presets.offscreen());
      v.resize(width, height, 'xMidYMid meet');
      await v.render();
      canvas.toBlob((blob) => {
        if (!blob) return;

        const reader = new FileReader();
        reader.onload = action(() => {
          if (reader.result) {
            localStorage.setItem(uuid, reader.result.toString());
          }
        });
        reader.readAsDataURL(blob);
      });
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
  });

  return (
    <>
      <Canvas
        ref={setSvgRef}
        paths={snapshot.paths}
        color={snapshot.color}
        onAddPath={handleAddPath}
      />
      <Toolbar
        color={snapshot.color}
        onPickColor={handlePickColor}
        onExport={handleExport}
      />
    </>
  );
});

export default App;
