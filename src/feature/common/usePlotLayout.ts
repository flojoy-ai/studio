import { useMantineTheme } from "@mantine/styles";
import { Layout } from "plotly.js";
import { useMemo } from "react";

const usePlotLayout = () => {
  const theme = useMantineTheme();
  const plotBackgroundColor =
    theme.colorScheme === "light" ? theme.white : theme.colors.dark[5];

  const defaultLayout: Partial<Layout> = {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: plotBackgroundColor,
    autosize: true,
    font: { color: theme.colors.title[0] },
    margin: { t: 40, r: 40, b: 40, l: 40 },
    xaxis: { zeroline: false, type: "linear" },
    showlegend: false,
  };
  return defaultLayout;
};

export default usePlotLayout;
