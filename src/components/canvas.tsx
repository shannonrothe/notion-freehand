import { styled } from '@stitches/react';
import { action } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react';
import getStroke from 'perfect-freehand';
import React from 'react';

type Point = {
  x: number;
  y: number;
};

function getColor(color: string) {
  const styles = getComputedStyle(document.documentElement);
  return styles.getPropertyValue(`--${color}`);
}

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

type State = {
  points: Point[];
  drawing: boolean;
};

const StyledPath = styled('path', {});
const Svg = styled('svg', {
  flex: '1 1 0%',
});

type CanvasProps = {
  color: string;
  paths: Path[];
  onAddPath: (path: Path) => void;
};

export const Canvas = observer((props: CanvasProps) => {
  const snapshot = useLocalObservable<State>(() => ({
    drawing: false,
    points: [],
  }));
  const { onAddPath, paths } = props;
  const outlinePoints = getStroke([...snapshot.points], {
    size: 5,
    smoothing: 1.5,
  });
  const path = getSvgPathFromStroke(outlinePoints);

  const addPoint = action((point: Point) => {
    snapshot.points = [...snapshot.points, point];
  });

  const handlePointerDown = action((e: React.PointerEvent) => {
    snapshot.drawing = true;
    addPoint({ x: e.clientX, y: e.clientY });
  });

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!snapshot.drawing) {
      return;
    }

    addPoint({ x: e.clientX, y: e.clientY });
  };

  const handlePointerUp = action(() => {
    snapshot.drawing = false;
    snapshot.points = [];
    onAddPath({ d: path, color: props.color });
  });

  return (
    <Svg
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
    >
      {paths.map((path, index) => (
        <StyledPath
          key={index}
          stroke={getColor(path.color)}
          fill={getColor(path.color)}
          d={path.d}
        />
      ))}
      {path && (
        <StyledPath
          stroke={getColor(props.color)}
          fill={getColor(props.color)}
          d={path}
        />
      )}
    </Svg>
  );
});
