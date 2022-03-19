export type Path = {
  d: string;
  color: string;
};

export interface HistoryEntry {
  redo: () => void;
  undo: () => void;
}

export type State = {
  color: string;
  dataUrl?: string;
  paths: Path[];
  history: HistoryEntry[];
  index: number;
  open: boolean;
  status: 'dirty' | 'saved';
};
