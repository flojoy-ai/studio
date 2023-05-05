import { MantineTheme, MantineThemeOverride } from "@mantine/core";

export const lightTheme: MantineThemeOverride = {
  colorScheme: "light",
  colors: {},
  // body: "#FFF",
  // text: "#282c34",
  // overlay: "rgba(255,255,255,0.75)",
  // underline: "#282c34",
  // borderColor: "#00000024",
};

export const darkTheme: MantineThemeOverride = {
  colorScheme: "dark",
  colors: {
    dark: [
      "#c1c2c5",
      "#a6a7ab",
      "#909296",
      "#5c5f66",
      "#373a40",
      "#2c2e33",
      "#25262b",
      "#000",
      "#141517",
      "#101113",
    ],
  },
  // body: "#000000cf",
  // text: "#FFF",
  // overlay: "rgba(0,0,0,0.75)",
  // underline: "black",
  // borderColor: "#ffffff38",
  // cyan: "#99f5ff",
};
