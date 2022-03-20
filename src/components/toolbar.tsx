import { styled } from '@stitches/react';
import { observer } from 'mobx-react';
import { Status } from '../types';
import { PrimaryButton, SecondaryButton } from './button';

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
  justifyContent: 'space-between',
  gap: 'var(--size-2)',
  padding: 'var(--scale-1)',
});

const ColorContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--size-2)',
});

const ButtonContainer = styled('div', {
  display: 'flex',
  alignItems: 'center',
  gap: 'var(--size-2)',
});

const StyledColorButton = styled('button', {
  all: 'unset',
  cursor: 'pointer',
  userSelect: 'none',
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

export const Toolbar = observer(
  ({
    color: selectedColor,
    status,
    onPickColor,
    onSave,
    onLogout,
  }: {
    color: string;
    status: Status;
    onPickColor: (color: string) => void;
    onLogout: () => void;
    onSave: () => void;
  }) => {
    const disabled = status === Status.SAVING || status === Status.SAVED;

    return (
      <ToolbarContainer>
        <ColorContainer>
          {COLORS.map((color) => (
            <ColorButton
              key={color}
              selected={color === selectedColor}
              color={color}
              onClick={onPickColor}
            />
          ))}
        </ColorContainer>
        <ButtonContainer>
          <PrimaryButton isDisabled={disabled} onClick={onSave}>
            Save
          </PrimaryButton>
          <SecondaryButton onClick={onLogout}>Log out</SecondaryButton>
        </ButtonContainer>
      </ToolbarContainer>
    );
  }
);
