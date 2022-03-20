import { Toolbar } from '../../components/toolbar';
import 'pollen-css';
import { Canvas } from '../../components/canvas';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { action, computed } from 'mobx';
import { useDrawing } from '../../hooks/use_drawing';
import { useHistory } from '../../hooks/use_history';
import { usePersist } from '../../hooks/use_persist';
import { Point, State, Status, WithDimensions } from '../../types';
import { LoadingBanner } from '../../components/loading_banner';
import supabase from '../../lib/client';
import { useNavigate } from 'react-router';
import { useEffect } from 'react';
import { styled } from '@stitches/react';
import { v4 } from 'uuid';
import getStroke from 'perfect-freehand';
import { Selection } from '../../components/selection';
import { useResize } from '../../hooks/use_resize';

const Svg = styled('svg', {
  flex: '1 1 0%',
});

export function getSvgPathFromStroke(stroke: number[][]) {
  if (!stroke.length) return '';

  const d = stroke.reduce(
    (acc, [x0, y0], i, arr) => {
      const [x1, y1] = arr[(i + 1) % arr.length];
      acc.push(x0, y0, (x0 + x1) / 2, (y0 + y1) / 2);
      return acc;
    },
    ['M', ...stroke[0], 'Q']
  );

  d.push('Z');
  return d.join(' ');
}

function toPath(points: WithDimensions<Point>[]) {
  const scaledPoints = points.map((p) => {
    const x = p.x / p.width;
    const y = p.y / p.height;
    return { x: x * window.innerWidth, y: y * window.innerHeight };
  });
  return getSvgPathFromStroke(
    getStroke([...scaledPoints], {
      size: 5,
      smoothing: 1.5,
    })
  );
}

export const Draw = observer(() => {
  const navigate = useNavigate();
  const store = useLocalObservable<State>(() => ({
    color: 'color-black',
    history: [],
    index: 0,
    open: false,
    status: Status.SAVED,
    selectedIds: [],
    drawing: false,
    points: [],
    committedPoints: [],
  }));
  const committedPaths = computed(() =>
    store.committedPoints.map((p) => ({
      id: v4(),
      color: p.color,
      d: toPath(p.points),
    }))
  );
  const selectedPaths = computed(() =>
    store.committedPoints
      .filter((p) => store.selectedIds.includes(p.id))
      .map((p) => ({ id: p.id, d: toPath(p.points) }))
  );
  const { name, isLoading } = useDrawing('', store);
  const { record } = useHistory(store);
  const { save } = usePersist(name, store);
  const path = toPath([...store.points]);
  useResize(store);

  useEffect(() => {
    const handleKeyDown = action((e: KeyboardEvent) => {
      if (e.key === 'a' && e.metaKey) {
        e.preventDefault();
        store.selectedIds = store.committedPoints.map((p) => p.id);
      } else if (e.key === 'Backspace') {
        store.committedPoints = store.committedPoints.filter(
          (p) => !store.selectedIds.includes(p.id)
        );
        store.selectedIds = [];
      }
    });
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handlePickColor = action((color: string) => (store.color = color));

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      navigate('/login');
    }
  };

  const addPoint = action((point: Point) => {
    store.points = [
      ...store.points,
      { ...point, width: window.innerWidth, height: window.innerHeight },
    ];
  });

  const handlePointerDown = action((e: React.PointerEvent) => {
    store.drawing = true;
    addPoint({ x: e.clientX, y: e.clientY });
  });

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!store.drawing) {
      return;
    }

    addPoint({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = action(() => {
    record({
      id: v4(),
      points: store.points,
      color: store.color,
    });
    store.drawing = false;
    store.points = [];
  });

  if (isLoading) {
    return <LoadingBanner />;
  }

  return (
    <>
      <Svg
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      >
        <Canvas paths={committedPaths} color={store.color} path={path} />
        <Selection paths={selectedPaths} />
      </Svg>
      <Toolbar
        color={store.color}
        status={store.status}
        onPickColor={handlePickColor}
        onLogout={handleLogout}
        onSave={save}
      />
    </>
  );
});
