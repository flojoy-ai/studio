import { Layout } from "plotly.js";

export const plotLayout = (theme: "dark" | "light") => {
  const accentColor = theme === "dark" ? "#99f5ff" : "#7b61ff";
  const plotBackgroundColor = theme === "light" ? "#fafafa" : "#171717";

  const defaultLayout: Partial<Layout> = {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: plotBackgroundColor,
    autosize: true,
    font: { color: accentColor },
    margin: { t: 32, r: 32, b: 32, l: 32 },
    xaxis: { zeroline: false, type: "-" },
    template: {},
  };
  return defaultLayout;
};
