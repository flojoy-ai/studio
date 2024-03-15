export const ALL_DC_TYPE = [
  "grayscale",
  "matrix",
  "dataframe",
  "image",
  "ordered_pair",
  "ordered_triple",
  "scalar",
  "plotly",
] as const;

export type DataContainerType = (typeof ALL_DC_TYPE)[number];

export type DataContainer = Scalar;

type Scalar = {
  type: "scalar";
  c: number;
};

// TODO: Add the rest
