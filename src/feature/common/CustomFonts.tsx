import { Global } from "@mantine/core";
// import ponymakerWoff2 from "@src/fonts/PonyMaker.woff2";
import ponymakerWoff from "@src/fonts/PonyMaker.woff";

export const CustomFonts = () => {
  return (
    <Global
      styles={[
        {
          "@font-face": {
            fontFamily: "PonyMaker",
            // src: `url(${ponymakerWoff2}) format("woff2"), url(${ponymakerWoff}) format("woff")`,
            src: `url(${ponymakerWoff}) format("woff")`,
            fontWeight: "normal",
            fontStyle: "normal",
            fontDisplay: "swap",
          },
        },
      ]}
    />
  );
};
