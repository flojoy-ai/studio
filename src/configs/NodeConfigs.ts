import ArithmeticNode from "@src/feature/flow_chart_panel/components/custom-nodes/ArithmeticNode";
import ConditionalNode from "@src/feature/flow_chart_panel/components/custom-nodes/ConditionalNode";
import SimulationNode from "@src/feature/flow_chart_panel/components/custom-nodes/SimulationNode";
import TerminatorNode from "@src/feature/flow_chart_panel/components/custom-nodes/TerminatorNode";
import VisorNode from "@src/feature/flow_chart_panel/components/custom-nodes/VisorNode";
import DefaultNode from "@src/feature/flow_chart_panel/components/DefaultNode";

export const nodeConfigs = {
  default: DefaultNode,
  ARITHMETIC: ArithmeticNode,
  SIMULATION: SimulationNode,
  VISOR: VisorNode,
  CONDITIONAL: ConditionalNode,
  TERMINATOR: TerminatorNode,
};
