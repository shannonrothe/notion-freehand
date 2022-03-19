import { Toolbar } from '../../components/toolbar';
import 'pollen-css';
import { Canvas } from '../../components/canvas';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { action } from 'mobx';
import { Modal } from '../../components/modal';
import { useDrawing } from '../../hooks/use_drawing';
import { useHistory } from '../../hooks/use_history';
import { usePersist } from '../../hooks/use_persist';
import { State, Status } from '../../types';
import { LoadingBanner } from '../../components/loading_banner';
import supabase from '../../lib/client';
import { useNavigate } from 'react-router';

export const Draw = observer(() => {
  const navigate = useNavigate();
  const store = useLocalObservable<State>(() => ({
    color: 'color-black',
    dataUrl: '',
    paths: [],
    history: [],
    index: 0,
    open: false,
    status: Status.SAVED,
  }));
  const { name, isLoading } = useDrawing('', store);
  const { record } = useHistory(store);
  const { save } = usePersist(name, store);

  const handlePickColor = action((color: string) => (store.color = color));

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      localStorage.removeItem('accessToken');
      navigate('/login');
    }
  };

  if (isLoading) {
    return <LoadingBanner />;
  }

  return (
    <>
      <Canvas paths={store.paths} color={store.color} onAddPath={record} />
      <Toolbar
        color={store.color}
        status={store.status}
        onPickColor={handlePickColor}
        onLogout={handleLogout}
        onSave={save}
      />
    </>
  );
});
