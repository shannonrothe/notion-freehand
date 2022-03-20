import { IComputedValue } from 'mobx';
import { observer } from 'mobx-react-lite';
import { StyledPath } from './path';

export const Selection = observer(
  ({ paths }: { paths: IComputedValue<{ id: string; d: string }[]> }) => {
    return (
      <>
        {paths.get().map((p) => (
          <StyledPath
            key={p.id}
            d={p.d}
            fill="var(--color-blue)"
            stroke="var(--color-blue)"
            strokeWidth={0.5}
          />
        ))}
      </>
    );
  }
);
