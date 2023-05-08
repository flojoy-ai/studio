import { MantineThemeOverride } from "@mantine/core";

const shared: MantineThemeOverride = {
  fontFamily: "sans-serif",
};

export const darkTheme: MantineThemeOverride = {
  ...shared,
  colorScheme: "dark",
  colors: {
    // Mantine uses dark[7] as body background color by default
    // Likewise it uses dark[0] for text color
    // Manually use dark[6] for modals
    dark: [
      "#bcc2c4",
      "#a6a7ab",
      "#909296",
      "#5c5f66",
      "#373a40",
      "#2c2e33",
      "#191919",
      "#111111",
      "#141517",
      "#101113",
    ],
    modal: ["#191919"],
    title: ["#ffffff"],
    text: ["#bcc2c4"],
    // accent[0] is accent #1 in the style guide, accent[1] is accent #2,
    // from the style guide, etc.
    accent: ["#99f5ff", "#7b61ff", "#ffc93f"],
  },
};

export const lightTheme: MantineThemeOverride = {
  ...shared,
  colorScheme: "light",
  colors: {
    modal: ["#f4f4f4"],
    title: ["#111111"],
    text: ["#8c9699"],
    accent: ["#2e83ff", "#7b61ff", "#ffa927"],
  },
};
