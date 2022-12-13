export type ResultIO = {
  cmd: string;
  id: string;
  result: {
    x?: number[] | null;
    y?: number[] | null;
    layout?: Record<string, string>;
    data?: {
      x: Array<number>;
      y: Array<number>;
    }[];
  };
};
export interface ResultsType {
  io?: ResultIO[];
}
