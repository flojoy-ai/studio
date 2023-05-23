import { useMantineTheme } from "@mantine/styles";
import { Layout } from "plotly.js";

const usePlotLayout = () => {
  const theme = useMantineTheme();
  const accentColor =
    theme.colorScheme === "dark"
      ? theme.colors.accent1[0]
      : theme.colors.accent2[0];
  const plotBackgroundColor =
    theme.colorScheme === "light" ? theme.white : theme.colors.dark[5];

  const dfltLayout: Partial<Layout> = {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: plotBackgroundColor,
    autosize: true,
    font: { color: accentColor },
    margin: { t: 40, r: 40, b: 40, l: 40 },
    xaxis: { zeroline: false, type: "linear" },
    template: {}
  };
  return dfltLayout;
};

export default usePlotLayout;
