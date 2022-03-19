import { runInAction } from 'mobx';
import { useEffect, useState } from 'react';
import { v4 } from 'uuid';
import { Path, State } from '../types';

const setPageTitle = (name: string) =>
  (document.title = `${name} - notion-freehand`);

export const useName = (initial: string, store: State) => {
  const [name, setName] = useState(initial);

  useEffect(() => {
    const _name = new URLSearchParams(window.location.search).get('name');
    if (_name) {
      setName(_name);
      setPageTitle(_name);
      try {
        const stored = localStorage.getItem(_name);
        if (!stored) {
          return;
        }
        const file = JSON.parse(stored);
        runInAction(() => {
          store.color = file.color;
          store.paths = file.paths;
        });
      } catch {
        // Unable to load file. Do nothing.
      }
    } else {
      const _name = v4();
      window.location.href = `${window.location.href}?name=${_name}`;
      setName(_name);
      setPageTitle(_name);
    }
  }, []);

  return { name };
};
