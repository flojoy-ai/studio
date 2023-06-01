import { Tuple, DefaultMantineColor } from "@mantine/core";

type ExtendedCustomColors =
  | "text"
  | "title"
  | "modal"
  | "accent1"
  | "accent2"
  | "accent3"
  | "accent4"
  | "accent5"
  | DefaultMantineColor;

declare module "@mantine/core" {
  export interface MantineThemeColorsOverride {
    colors: Record<ExtendedCustomColors, Tuple<string, 10>>;
  }
}
