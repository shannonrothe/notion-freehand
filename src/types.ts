export type Path = {
  id: string;
  points: WithDimensions<Point>[];
  color: string;
};

export type RenderedPath = Omit<Path, 'points'> & {
  d: string;
};

export interface HistoryEntry {
  redo: () => void;
  undo: () => void;
}

export enum Status {
  DIRTY,
  SAVING,
  SAVED,
}

export type Dimensions = {
  width: number;
  height: number;
};
export type WithDimensions<T> = T & Dimensions;
export type WithColor<T> = T & {
  color: string;
};

export type State = {
  color: string;
  committedPoints: WithColor<{ id: string; points: WithDimensions<Point>[] }>[];
  points: WithDimensions<Point>[];
  history: HistoryEntry[];
  index: number;
  open: boolean;
  status: Status;
  selectedIds: string[];
  drawing: boolean;
};

export type Point = {
  x: number;
  y: number;
};
