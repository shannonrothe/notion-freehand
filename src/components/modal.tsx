import { Dialog } from '@headlessui/react';
import { styled } from '@stitches/react';
import { action, runInAction } from 'mobx';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { StyledInput } from './input';
import { StyledButton } from './toolbar';

const StyledOverlay = styled(Dialog.Overlay, {
  position: 'fixed',
  background: 'rgba(0, 0, 0, 0.25)',
  inset: 0,
});

const Container = styled('div', {
  position: 'absolute',
  left: '50%',
  top: '50%',
  transform: 'translate(-50%, -50%)',
  background: 'white',
  borderRadius: 'var(--radius-md)',
  padding: 'var(--size-4)',
});

export const Modal = observer(
  ({
    open,
    onClose,
    onConfirm,
  }: {
    open: boolean;
    onClose: () => void;
    onConfirm: (name: string) => void;
  }) => {
    const store = useLocalObservable(() => ({
      name: '',
    }));
    const handleClose = () => {
      onClose();
      runInAction(() => (store.name = ''));
    };

    const handleSave = () => {
      onConfirm(store.name);
      handleClose();
    };

    return (
      <Dialog
        as="div"
        style={{
          position: 'fixed',
          inset: 0,
          overflowY: 'auto',
          zIndex: 'var(--layer-1)',
        }}
        open={open}
        onClose={handleClose}
      >
        <StyledOverlay />
        {/* <Dialog.Overlay /> */}
        <Container>
          <Dialog.Title
            style={{
              fontFamily: 'var(--font-sans)',
              margin: '0 0 var(--size-5) 0',
              fontSize: 'var(--scale-1)',
            }}
          >
            Save Drawing
          </Dialog.Title>
          <StyledInput
            placeholder="Drawing name"
            value={store.name}
            onChange={action((e) => (store.name = e.target.value))}
          />
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              alignItems: 'center',
              marginTop: '1rem',
            }}
          >
            <StyledButton onClick={handleSave}>Save</StyledButton>
          </div>
        </Container>
      </Dialog>
    );
  }
);
