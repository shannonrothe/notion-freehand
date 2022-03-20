import { useEffect, useState } from 'react';
import { Path, State, WithDimensions } from '../types';
import supabase from '../lib/client';
import { action } from 'mobx';
import { v4 } from 'uuid';
import { User } from '@supabase/supabase-js';
import { useAuth } from './use_auth';
import { useNavigate } from 'react-router';

const setPageTitle = (name: string) =>
  (document.title = `${name} - notion-freehand`);

class DrawingPresenter {
  constructor(private readonly user: User | null) {}

  async fetch(name: string): Promise<WithDimensions<Path>[]> {
    if (!this.user) {
      return Promise.reject();
    }

    let pathsResp: { paths: WithDimensions<Path>[] } = { paths: [] };

    const resp = await supabase
      .from('drawings')
      .select('paths')
      .eq('name', name)
      .eq('user_id', this.user.id)
      .single();
    if (resp.error) {
      const createResp = await supabase
        .from('drawings')
        .insert({
          name,
          user_id: this.user.id,
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
  const navigate = useNavigate();
  const user = useAuth();
  const [presenter] = useState(() => new DrawingPresenter(user));
  const [isLoading, setIsLoading] = useState(true);
  const [name, setName] = useState(initial);

  useEffect(() => {
    setIsLoading(true);
    const _name = new URLSearchParams(window.location.search).get('name');
    if (_name) {
      setName(_name);
      setPageTitle(_name);
      presenter
        .fetch(_name)
        .then(
          action((paths) => {
            store.paths = paths;
            setIsLoading(false);
          })
        )
        .catch(() => navigate('/login'));
    } else {
      window.location.href = `${window.location.href}?name=${v4()}`;
    }
  }, []);

  return { name, isLoading };
};
