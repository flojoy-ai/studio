import ArithmeticNode from "@src/feature/flow_chart_panel/components/custom-nodes/ArithmeticNode";
import ConditionalNode from "@src/feature/flow_chart_panel/components/custom-nodes/ConditionalNode";
import SimulationNode from "@src/feature/flow_chart_panel/components/custom-nodes/SimulationNode";
import TerminatorNode from "@src/feature/flow_chart_panel/components/custom-nodes/TerminatorNode";
import VisorNode from "@src/feature/flow_chart_panel/components/custom-nodes/VisorNode";
import DefaultNode from "@src/feature/flow_chart_panel/components/DefaultNode";
import ScipyNode from "@src/feature/flow_chart_panel/components/custom-nodes/ScipyNode";
import NumpyNode from "@src/feature/flow_chart_panel/components/custom-nodes/NumpyNode";

export const nodeConfigs = {
  default: DefaultNode,
  ARITHMETIC: ArithmeticNode,
  SIMULATION: SimulationNode,
  PLOTLY_VISOR: VisorNode,
  CONDITIONAL: ConditionalNode,
  TERMINATOR: TerminatorNode,
  SAMPLE_IMAGE: DefaultNode,
  AI_OBJECT_DETECTION: DefaultNode,
  SCIPY_STATS: ScipyNode,
  SCIPY_SIGNAL: ScipyNode,
  NUMPY_RANDOM: NumpyNode,
  NUMPY_LINALG: NumpyNode,
};
