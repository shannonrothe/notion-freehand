import { action } from 'mobx';
import { useEffect } from 'react';
import { State } from '../types';

export const useResize = (store: State) => {
  useEffect(() => {
    const onResize = action(() => {
      store.paths = store.paths.map((p) => ({
        ...p,
        points: p.points.map((point) => {
          const x = point.x / point.width;
          const y = point.y / point.height;
          return {
            x: window.innerWidth * x,
            y: window.innerHeight * y,
            width: window.innerWidth,
            height: window.innerHeight,
          };
        }),
      }));
    });
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, []);
};
