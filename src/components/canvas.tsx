import { IComputedValue } from 'mobx';
import { observer } from 'mobx-react';
import { Path, RenderedPath } from '../types';
import { StyledPath } from './path';

type CanvasProps = {
  color: string;
  paths: IComputedValue<RenderedPath[]>;
  path: string;
};

export function getColor(color: string) {
  const styles = getComputedStyle(document.documentElement);
  return styles.getPropertyValue(`--${color}`);
}

export const Canvas = observer((props: CanvasProps) => {
  const { path, paths } = props;

  return (
    <>
      {paths.get().map((path, index) => (
        <StyledPath
          key={index}
          strokeWidth={1}
          stroke={getColor(path.color)}
          fill={getColor(path.color)}
          d={path.d}
        />
      ))}
      {path && (
        <StyledPath
          strokeWidth={1}
          stroke={getColor(props.color)}
          fill={getColor(props.color)}
          d={path}
        />
      )}
    </>
  );
});
