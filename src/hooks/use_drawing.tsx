import { useEffect, useState } from 'react';
import { Path, State } from '../types';
import supabase from '../lib/client';
import { action } from 'mobx';
import { v4 } from 'uuid';

const setPageTitle = (name: string) =>
  (document.title = `${name} - notion-freehand`);

class DrawingPresenter {
  async fetch(name: string): Promise<Path[]> {
    let pathsResp: { paths: Path[] } = { paths: [] };

    const resp = await supabase
      .from('drawings')
      .select('paths')
      .eq('name', name)
      .single();
    if (resp.error) {
      const createResp = await supabase
        .from('drawings')
        .insert({
          name,
        })
        .single();
      if (!createResp.error) {
        pathsResp = createResp.data;
      }
    } else {
      pathsResp = resp.data;
    }

    return pathsResp.paths;
  }
}

export const useDrawing = (initial: string, store: State) => {
  const [presenter] = useState(() => new DrawingPresenter());
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState(initial);

  useEffect(() => {
    setIsLoading(true);
    const _name = new URLSearchParams(window.location.search).get('name');
    if (_name) {
      setName(_name);
      setPageTitle(_name);
      presenter.fetch(_name).then(
        action((paths) => {
          store.paths = paths;
          setIsLoading(false);
        })
      );
    } else {
      window.location.href = `${window.location.href}?name=${v4()}`;
    }
  }, []);

  return { name, isLoading };
};
