import type { CustomNodeProps } from "./types/nodeProps";
import NodeWrapper from "./components/NodeWrapper";
import HandleComponent from "./components/HandleComponent";
import { memo } from "react";
import Scatter from "./assets/nodes/Scatter";
import CompositePlot from "./assets/nodes/CompositePlot";
import ProphetComponents from "./assets/nodes/ProphetComponents";
import ProphetPlot from "./assets/nodes/ProphetPlot";
import ArrayView from "./assets/nodes/ArrayView";
import MatrixView from "./assets/nodes/MatrixView";
import BigNumber from "./assets/nodes/BigNumber";
import BoxPlot from "./assets/nodes/BoxPlot";
import Histogram from "./assets/nodes/Histogram";
import LineChart from "./assets/nodes/LineChart";
import Scatter3D from "./assets/nodes/3DScatter";
import Surface3D from "./assets/nodes/3DSurface";
import Bar from "./assets/nodes/Bar";
import Table from "./assets/nodes/Table";
import Image from "./assets/nodes/Image";
import PeakFinder from "./assets/nodes/PeakFinder";
import RegionInspector from "./assets/nodes/RegionInspector";
import TextView from "./assets/nodes/TextView";
import Heatmap from "./assets/nodes/Heatmap";

const chartElemMap: { [func: string]: React.JSX.Element } = {
  SCATTER: <Scatter />,
  HISTOGRAM: <Histogram />,
  LINE: <LineChart />,
  SURFACE3D: <Surface3D />,
  SCATTER3D: <Scatter3D />,
  BAR: <Bar />,
  TABLE: <Table />,
  IMAGE: <Image />,
  BOX: <BoxPlot />,
  BIG_NUMBER: <BigNumber />,
  MATRIX_VIEW: <MatrixView />,
  ARRAY_VIEW: <ArrayView />,
  PROPHET_PLOT: <ProphetPlot />,
  PROPHET_COMPONENTS: <ProphetComponents />,
  COMPOSITE: <CompositePlot />,
  TEXT_VIEW: <TextView />,
  EXTREMA_DETERMINATION: <PeakFinder />,
  REGION_PROPERTIES: <RegionInspector />,
  HEATMAP: <Heatmap />,
};

const VisorNode = ({ data }: CustomNodeProps) => {
  return (
    <NodeWrapper>
      <div className="rounded-2xl bg-transparent">
        {chartElemMap[data.func]}
        <HandleComponent data={data} variant="accent2" />
      </div>
    </NodeWrapper>
  );
};

export default memo(VisorNode);
