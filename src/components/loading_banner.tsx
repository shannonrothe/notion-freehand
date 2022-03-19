import { styled } from '@stitches/react';

const StyledLoadingBanner = styled('div', {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.5)',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 'var(--layer-0)',
});

const LoadingText = styled('p', {
  fontFamily: 'var(--font-sans)',
  fontWeight: 'var(--weight-medium)',
  color: 'white',
  zIndex: 'var(--layer-1)',
});

export const LoadingBanner = () => {
  return (
    <StyledLoadingBanner>
      <LoadingText>Loading drawing...</LoadingText>
    </StyledLoadingBanner>
  );
};
