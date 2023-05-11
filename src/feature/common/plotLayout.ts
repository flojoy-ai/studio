import { MantineTheme, useMantineTheme } from "@mantine/styles";
import { Layout } from "plotly.js";

const usePlotLayout = () => {
  const theme = useMantineTheme();
  const plotBackgroundColor =
    theme.colorScheme === "light" ? theme.white : theme.colors.dark[5];

  const dfltLayout: Partial<Layout> = {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: plotBackgroundColor,
    autosize: true,
    font: { color: theme.colors.title[0] },
    margin: { t: 40, r: 40, b: 40, l: 40 },
    xaxis: { zeroline: false, type: "linear" },
    showlegend: false,

    // yaxis: {zeroline: false, color: plotFeatureColor}
  };
  return dfltLayout;
};

export default usePlotLayout;
