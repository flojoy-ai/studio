export const PLOT_WIDTH = 360;
export const PLOT_HEIGHT = 224;

export type Color = [number, number, number, number];
export type Theme = {
  bg: Color,
  accent: Color,
}

export const lightTheme: Theme = {
  bg: [0.98, 0.98, 0.98, 1],
  accent: [0.48, 0.38, 1, 1],
};

export const darkTheme: Theme = {
  bg: [0.05, 0.05, 0.05, 1],
  accent: [0.598, 0.957, 1, 1],
};
