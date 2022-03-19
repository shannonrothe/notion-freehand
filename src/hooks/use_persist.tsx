import { styled } from '@stitches/react';
import { action, runInAction } from 'mobx';
import { useEffect } from 'react';
import { toastful } from 'react-toastful';
import { State, Status } from '../types';
import supabase from '../lib/client';

const Success = styled('p', {
  fontFamily: 'var(--font-sans)',
  fontSize: 'var(--scale-00)',
});

export const usePersist = (name: string, store: State) => {
  useEffect(() => {
    const onBeforeUnload = (e: BeforeUnloadEvent) => {
      if (store.status === Status.DIRTY) {
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

  const save = async () => {
    runInAction(() => (store.status = Status.SAVING));
    const resp = await supabase
      .from('drawings')
      .update({ paths: store.paths })
      .eq('name', name);
    if (resp.error) {
      runInAction(() => (store.status = Status.DIRTY));
    } else {
      toastful.success(<Success>Changes saved</Success>, {
        position: 'bottom_right',
      });
      runInAction(() => {
        store.status = Status.SAVED;
      });
    }
  };

  return { save };
};
