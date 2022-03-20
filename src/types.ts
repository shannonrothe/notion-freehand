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
export type WithDimensions<T extends Point | Path> = T & Dimensions;

export type State = {
  color: string;
  paths: Path[];
  history: HistoryEntry[];
  index: number;
  open: boolean;
  status: Status;
  selectedIds: string[];
  drawing: boolean;
  points: WithDimensions<Point>[];
};

export type Point = {
  x: number;
  y: number;
};
