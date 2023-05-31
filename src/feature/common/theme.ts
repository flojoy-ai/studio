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
    modal: ["#191919", "#111111"],
    title: ["#ffffff"],
    text: ["#bcc2c4"],
    accent1: ["#99f5ff", "#48abe0", "#d4fbff"],
    accent2: ["#7b61ff", "#7418b5"],
    accent3: ["#ffc93f"],
    accent4: ["rgba(153, 245, 255, 1)", "rgba(153, 245, 255, 0.2)"], //for add buttons and leaf nodes
    accent5: ["#303030", "rgba(237, 237, 237, 0.2)"],
  },
};

export const lightTheme: MantineThemeOverride = {
  ...shared,
  colorScheme: "light",
  colors: {
    gray: [
      "#f8f9fa",
      "#f1f3f5",
      "#e9ecef",
      "#dee2e6",
      "#ced4da",
      "#adb5bd",
      "#868e96",
      "#495057",
      "#343a40",
      "#212529",
    ],
    modal: ["#f4f4f4", "#ffffff"],
    title: ["#111111"],
    text: ["#8c9699"],
    accent1: ["#2e83ff", "#578bf2", "#2E83FF33", "#d4fbff"],
    accent2: ["#7b61ff", "#7418b5", "#af9fff"],
    accent3: ["#ffa927"],
    accent4: ["rgba(123, 97, 255, 1)", "rgba(123, 97, 255, 0.17)"], //for add button and leaf nodes
    accent5: ["#EDEDED", "rgba(237, 237, 237, 0.2)"],
  },
};
