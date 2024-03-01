import { memo } from "react";
import { resolveBlockSVG } from "../svg-helper";
// import scatterSvg from "./scatter-svg";
// import histogramSvg from "./histogram-svg";
// import lineChartSvg from "./line-chart-svg";
// import surface3dSvg from "./surface3d-svg";
// import scatter3dSvg from "./scatter3d-svg";
// import barSvg from "./bar-svg";
// import tableSvg from "./table-svg";
// import imageSvg from "./image-svg";
// import boxPlotSvg from "./box-plot-svg";
// import bigNumberSvg from "./big-number-svg";
// import matrixViewSvg from "./matrix-view-svg";
// import arrayViewSvg from "./array-view-svg";
// import prophetPlotSvg from "./prophet-plot-svg";
// import prophetComponentsSvg from "./prophet-components-svg";
// import compositePlotSvg from "./composite-plot-svg";
// import textViewSvg from "./text-view-svg";
// import peakFinderSvg from "./peak-finder-svg";
// import regionInspectorSvg from "./region-inspector-svg";
// import pieChartSvg from "./pie-chart-svg";
// import heatmapSvg from "./heatmap-svg";

const DefaultVisorSVG = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="100%"
    height="100%"
    viewBox="0 0 100 100"
  >
    <path
      className="fill-accent5"
      d="M80.863 45.488h13.551v49.02h2.824v3.137l-94.473.004V2.352h3.137v11.195h10.312v3.136l-10.312.004v42.57c13.41-4.41 17.43-8.55 22.488-13.746 2-2.058 4.137-4.254 7.039-6.726 7.488-6.332 11.824-3.098 16.785.57 3.02 2.254 6.332 4.707 10.863 4.41 3.117-.195 7.488-2.39 12.371-5.863 5.41-3.844 11.352-9.235 16.844-15.195l1.059-1.156 2.312 2.117-1.058 1.156c-5.649 6.117-11.767 11.648-17.353 15.629-5.331 3.805-10.272 6.215-14 6.45-5.668.35-9.449-2.45-12.902-5.04-3.902-2.902-7.312-5.43-12.902-.707-2.804 2.371-4.882 4.531-6.824 6.512-5.629 5.785-9.883 10.078-24.746 14.863l.004 31.98h6.43V73.88h15.137v20.63h7.215l.004-40.707h15.117V94.51h7.214V62.038h15.117V94.51h7.215V45.49zm10.41 3.14h-8.844v45.884h8.844zM24.293 77.02h-8.824v17.492h8.844V77.02zm44.648-11.844h-8.844v29.336h8.844zM46.629 56.94h-8.844v37.57h8.844zm-11.883-43.39h1.57v3.136H24.472V13.55zm58.508 0h1.57v3.136H82.98V13.55zm-20.098 0h1.57v3.136H62.882V13.55zm-20.098 0h1.57v3.136H44.57V13.55z"
    ></path>
  </svg>
);

const blockNameToSVGMap = {
  default: DefaultVisorSVG,
  //   SCATTER: scatterSvg,
  // HISTOGRAM: histogramSvg,
  //   LINE: lineChartSvg,
  //   SURFACE3D: surface3dSvg,
  //   SCATTER3D: scatter3dSvg,
  //   BAR: barSvg,
  //   TABLE: tableSvg,
  //   IMAGE: imageSvg,
  //   BOX: boxPlotSvg,
  //   BIG_NUMBER: bigNumberSvg,
  //   MATRIX_VIEW: matrixViewSvg,
  //   ARRAY_VIEW: arrayViewSvg,
  //   PROPHET_PLOT: prophetPlotSvg,
  //   PROPHET_COMPONENTS: prophetComponentsSvg,
  //   COMPOSITE: compositePlotSvg,
  //   TEXT_VIEW: textViewSvg,
  //   EXTREMA_DETERMINATION: peakFinderSvg,
  //   REGION_PROPERTIES: regionInspectorSvg,
  //   PIE_CHART: pieChartSvg,
  //   HEATMAP: heatmapSvg,
};
const VisorSVG = resolveBlockSVG(blockNameToSVGMap);

export default memo(VisorSVG);
