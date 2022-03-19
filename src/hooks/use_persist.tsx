import { styled } from '@stitches/react';
import { action } from 'mobx';
import { useEffect } from 'react';
import { toastful } from 'react-toastful';
import { State } from '../types';

const Success = styled('div', {
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--scale-00)',
});

export const usePersist = (name: string, store: State) => {
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (store.status === 'dirty') {
        const leave = confirm(
          'You have unsaved changes. Are you sure you want to leave?'
        );
        if (!leave) {
          e.preventDefault();
          e.returnValue = '';
        }
      }
    };

    window.addEventListener('beforeunload', onBeforeUnload);

    return () => {
      window.addEventListener('beforeunload', onBeforeUnload);
    };
  });

  const save = action(() => {
    localStorage.setItem(name, JSON.stringify(store));
    toastful.success(<Success>Changes saved</Success>, {
      position: 'bottom_right',
    });
    store.status = 'saved';
  });

  return { save };
};
