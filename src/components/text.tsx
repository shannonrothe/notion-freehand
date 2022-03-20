import { styled } from '@stitches/react';

export const Text = styled('p', {
  margin: 0,
  fontFamily: 'var(--font-sans)',
  color: 'var(--color-black)',
  variants: {
    align: {
      center: {
        textAlign: 'center',
      },
    },
    variant: {
      body: {
        color: 'var(--color-grey-700)',
        fontSize: 'var(--scale-000)',
      },
    },
  },
});
