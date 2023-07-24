import ConditionalNode from "@src/feature/flow_chart_panel/components/custom-nodes/ConditionalNode";
import VisorNode from "@src/feature/flow_chart_panel/components/custom-nodes/VisorNode";
import ScipyNode from "@src/feature/flow_chart_panel/components/custom-nodes/ScipyNode";
import NumpyNode from "@src/feature/flow_chart_panel/components/custom-nodes/NumpyNode";
import DataNode from "@src/feature/flow_chart_panel/components/custom-nodes/DataNode";
import ETLNode from "@src/feature/flow_chart_panel/components/custom-nodes/ETLNode";
import IONode from "@src/feature/flow_chart_panel/components/custom-nodes/IONode";
import LoopNode from "@src/feature/flow_chart_panel/components/custom-nodes/LoopNode";
import ArithmeticNode from "@src/feature/flow_chart_panel/components/custom-nodes/ArithmeticNode";
import LogicNode from "@src/feature/flow_chart_panel/components/custom-nodes/LogicNode";

export const nodeConfigs = {
  default: ETLNode,
  AI_ML: DataNode,
  GENERATORS: DataNode,
  VISUALIZERS: VisorNode,
  EXTRACTORS: ETLNode,
  TRANSFORMERS: ETLNode,
  LOADERS: ETLNode,
  ARITHMETIC: ArithmeticNode,
  INSTRUMENTS: IONode,
  LOGIC_GATES: LogicNode,
  CONDITIONALS: ConditionalNode,
  LOOPS: LoopNode,
  SCIPY: ScipyNode,
  NUMPY: NumpyNode,
};
