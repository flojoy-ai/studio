import ArithmeticNode from "@src/feature/flow_chart_panel/components/custom-nodes/ArithmeticNode";
import ConditionalNode from "@src/feature/flow_chart_panel/components/custom-nodes/ConditionalNode";
import SimulationNode from "@src/feature/flow_chart_panel/components/custom-nodes/SimulationNode";
import TerminatorNode from "@src/feature/flow_chart_panel/components/custom-nodes/TerminatorNode";
import VisorNode from "@src/feature/flow_chart_panel/components/custom-nodes/VisorNode";
import DefaultNode from "@src/feature/flow_chart_panel/components/DefaultNode";
import ScipyNode from "@src/feature/flow_chart_panel/components/custom-nodes/ScipyNode";
import NumpyNode from "@src/feature/flow_chart_panel/components/custom-nodes/NumpyNode";
import DataNode from "@src/feature/flow_chart_panel/components/custom-nodes/DataNode";
import ETLNode from "@src/feature/flow_chart_panel/components/custom-nodes/ETLNode";
import IONode from "@src/feature/flow_chart_panel/components/custom-nodes/IONode";

export const nodeConfigs = {
  default: ETLNode,
  ARITHMETIC: ArithmeticNode,
  SIMULATIONS: DataNode,
  PLOTLY: VisorNode,
  CONDITIONALS: ConditionalNode,
  TERMINATORS: IONode,
  SAMPLE_IMAGE: DefaultNode,
  AI_OBJECT_DETECTION: DefaultNode,
  SCIPY_STATS: ScipyNode,
  SCIPY_SIGNAL: ScipyNode,
  LINALG: NumpyNode,
};
