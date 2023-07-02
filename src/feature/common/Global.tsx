import { Global } from "@mantine/core";

export const GlobalStyles = () => {
  return (
    <Global
      styles={(theme) => ({
        "*, *::after, *::before": { boxSizing: "border-box" },
        body: {
          color: theme.colors.title[0],
        },
        main: {
          color: theme.colors.title[0],
        },
      })}
    />
  );
};
