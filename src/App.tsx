import { Toolbar } from './components/toolbar';
import 'pollen-css';
import { Canvas } from './components/canvas';
import { observer, useLocalObservable } from 'mobx-react-lite';
import { action } from 'mobx';
import './App.css';
import { Modal } from './components/modal';
import { useName } from './hooks/use_name';
import { useHistory } from './hooks/use_history';
import { usePersist } from './hooks/use_persist';
import { State } from './types';

const App = observer(() => {
  const store = useLocalObservable<State>(() => ({
    color: 'color-black',
    dataUrl: '',
    paths: [],
    history: [],
    index: 0,
    open: false,
    status: 'saved',
  }));
  const { name } = useName('', store);
  const { record } = useHistory(store);
  const { save } = usePersist(name, store);

  const handlePickColor = action((color: string) => (store.color = color));

  const handleSave = action(() => {
    if (name) {
      localStorage.setItem(name, JSON.stringify(store));
      store.status = 'saved';
    }
  });

  return (
    <>
      <Canvas paths={store.paths} color={store.color} onAddPath={record} />
      <Toolbar
        color={store.color}
        status={store.status}
        onPickColor={handlePickColor}
        onExport={save}
      />
      <Modal
        open={store.open}
        onClose={action(() => (store.open = false))}
        onConfirm={handleSave}
      />
    </>
  );
});

export default App;
