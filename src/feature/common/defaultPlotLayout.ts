import { Layout } from "plotly.js/dist/plotly-flojoyCustomBundle.js";

const styledPlotLayout = (theme: "light" | "dark") => {
  const plotFeatureColor = "#282c34";
  const plotBackgroundColor = theme === "light" ? "#fff" : "#282c34";

  const dfltLayout: Partial<Layout> = {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: plotBackgroundColor,
    autosize: true,
    font: { color: plotFeatureColor },
    margin: { t: 40, r: 40, b: 40, l: 40 },
    xaxis: { zeroline: false, type: "linear" },
    // yaxis: {zeroline: false, color: plotFeatureColor}
  };
  return dfltLayout;
};

export default styledPlotLayout;
