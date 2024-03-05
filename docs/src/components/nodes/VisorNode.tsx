import type { CustomNodeProps } from "@/components/nodes/types/nodeProps";
import NodeWrapper from "@/components/nodes/components/NodeWrapper";
import HandleComponent from "@/components/nodes/components/HandleComponent";
import { memo } from "react";
import Scatter from "@/components/nodes/assets/nodes/Scatter";
import CompositePlot from "@/components/nodes/assets/nodes/CompositePlot";
import ProphetComponents from "@/components/nodes/assets/nodes/ProphetComponents";
import ProphetPlot from "@/components/nodes/assets/nodes/ProphetPlot";
import ArrayView from "@/components/nodes/assets/nodes/ArrayView";
import MatrixView from "@/components/nodes/assets/nodes/MatrixView";
import BigNumber from "@/components/nodes/assets/nodes/BigNumber";
import BoxPlot from "@/components/nodes/assets/nodes/BoxPlot";
import Histogram from "@/components/nodes/assets/nodes/Histogram";
import LineChart from "@/components/nodes/assets/nodes/LineChart";
import Scatter3D from "@/components/nodes/assets/nodes/3DScatter";
import Surface3D from "@/components/nodes/assets/nodes/3DSurface";
import Bar from "@/components/nodes/assets/nodes/Bar";
import Table from "@/components/nodes/assets/nodes/Table";
import Image from "@/components/nodes/assets/nodes/Image";
import PeakFinder from "@/components/nodes/assets/nodes/PeakFinder";
import RegionInspector from "@/components/nodes/assets/nodes/RegionInspector";
import TextView from "@/components/nodes/assets/nodes/TextView";
import Heatmap from "@/components/nodes/assets/nodes/Heatmap";

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
