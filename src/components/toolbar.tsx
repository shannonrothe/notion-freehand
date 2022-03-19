import { styled } from '@stitches/react';

const COLORS = [
  'color-red',
  'color-orange',
  'color-yellow',
  'color-green',
  'color-blue',
  'color-purple',
  'color-black',
];

const ToolbarContainer = styled('div', {
  width: 'var(--size-full)',
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--size-2)',
  padding: 'var(--scale-1)',
});

const StyledColorButton = styled('button', {
  all: 'unset',
  cursor: 'pointer',
  width: 'var(--size-6)',
  height: 'var(--size-6)',
  borderRadius: 'var(--radius-full)',
  variants: {
    selected: {
      true: {
        outline: '2px solid var(--color-black)',
        outlineOffset: '2px',
      },
    },
  },
});

const StyledExportButton = styled('button', {
  all: 'unset',
  cursor: 'pointer',
  padding: 'var(--size-2) var(--size-3)',
  borderRadius: 'var(--radius-full)',
  fontSize: 'var(--scale-000)',
  fontFamily: 'var(--font-sans)',
  fontWeight: 'var(--weight-medium)',
  background: 'white',
  color: 'var(--color-black)',
  border: '1px solid var(--color-black)',
  userSelect: 'none',
  '&:hover': {
    background: 'var(--color-grey-50)',
  },
});

const ColorButton = ({
  color,
  onClick,
  selected,
}: {
  color: string;
  onClick: (color: string) => void;
  selected: boolean;
}) => {
  const handleClick = () => onClick(color);

  return (
    <StyledColorButton
      css={{ background: `var(--${color})` }}
      selected={selected}
      onClick={handleClick}
    />
  );
};

export const Toolbar = ({
  color: selectedColor,
  onPickColor,
  onExport,
}: {
  color: string;
  onPickColor: (color: string) => void;
  onExport: () => void;
}) => {
  return (
    <ToolbarContainer>
      {COLORS.map((color) => (
        <ColorButton
          key={color}
          selected={color === selectedColor}
          color={color}
          onClick={onPickColor}
        />
      ))}
      <StyledExportButton onClick={onExport}>Export</StyledExportButton>
    </ToolbarContainer>
  );
};
