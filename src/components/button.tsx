import { styled } from '@stitches/react';

const buttonStyles = {
  all: 'unset',
  cursor: 'pointer',
  padding: 'var(--size-2) var(--size-3)',
  borderRadius: 'var(--radius-full)',
  fontSize: 'var(--scale-000)',
  fontFamily: 'var(--font-sans)',
  fontWeight: 'var(--weight-medium)',
  transition: 'background 200ms var(--easing-standard)',
  variants: {
    isDisabled: {
      true: {
        pointerEvents: 'none',
        opacity: '0.5',
      },
    },
  },
};

export const PrimaryButton = styled('button', {
  ...buttonStyles,
  background: 'white',
  color: 'var(--color-black)',
  border: '1px solid var(--color-black)',
  userSelect: 'none',
  '&:hover': {
    background: 'var(--color-grey-50)',
  },
});

export const SecondaryButton = styled('button', {
  ...buttonStyles,
  background: 'var(--color-black)',
  color: 'var(--color-grey-50)',
  border: '1px solid transparent',
  userSelect: 'none',
  '&:hover': {
    background: 'var(--color-grey-700)',
  },
});
