export type ResultIO = {
  cmd: string;
  id: string;
  result: {
    x?: number[] | null;
    y?: number[] | null;
    z?: number[] | null;
    layout?: Record<string, string>;
    data?: {
      x: Array<number>;
      y: Array<number>;
      z?: Array<number>;
      type?: string;
      mode?: string;
    }[];
  };
};
export interface ResultsType {
  io?: ResultIO[];
}
