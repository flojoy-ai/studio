import { Global } from "@mantine/core";
import ponymaker from "../../PonyMaker.woff2";

export const CustomFonts = () => {
  return (
    <Global
      styles={[
        {
          "@font-face": {
            fontFamily: "PonyMaker",
            src: `url(${ponymaker}) format("woff2")`,
            fontWeight: "normal",
            fontStyle: "normal",
          },
        },
      ]}
    />
  );
};
