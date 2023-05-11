import { MantineTheme } from "@mantine/styles";
import { Layout } from "plotly.js";
import { darkTheme, lightTheme } from "./theme";

const plotLayout = (theme: "dark" | "light") => {
  const plotFeatureColor = theme === "light" ? "#000" : "#fff";
  const plotBackgroundColor = theme === "light" ? "#fff" : "#282c34";

  const dfltLayout: Partial<Layout> = {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: plotBackgroundColor,
    autosize: true,
    font: { color: plotFeatureColor },
    margin: { t: 40, r: 40, b: 40, l: 40 },
    xaxis: { zeroline: false, type: "linear" },
    showlegend: false,
    // yaxis: {zeroline: false, color: plotFeatureColor}
  };
  return dfltLayout;
};

export default plotLayout;
