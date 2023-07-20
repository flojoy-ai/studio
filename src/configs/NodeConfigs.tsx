import ConditionalNode from "@src/feature/flow_chart_panel/components/custom-nodes/ConditionalNode";
import VisorNode from "@src/feature/flow_chart_panel/components/custom-nodes/VisorNode";
import ScipyNode from "@src/feature/flow_chart_panel/components/custom-nodes/ScipyNode";
import NumpyNode from "@src/feature/flow_chart_panel/components/custom-nodes/NumpyNode";
import DataNode from "@src/feature/flow_chart_panel/components/custom-nodes/DataNode";
import ETLNode from "@src/feature/flow_chart_panel/components/custom-nodes/ETLNode";
import IONode from "@src/feature/flow_chart_panel/components/custom-nodes/IONode";
import LoopNode from "@src/feature/flow_chart_panel/components/custom-nodes/LoopNode";
import ArithmeticNode from "@src/feature/flow_chart_panel/components/custom-nodes/ArithmeticNode";

export const nodeConfigs = {
  default: ETLNode,
  ARITHMETIC: ArithmeticNode,
  SIMULATIONS: DataNode,
  PLOTLY: VisorNode,
  CONDITIONALS: ConditionalNode,
  LOOPS: LoopNode,
  KEITHLEY: IONode,
  LABJACK: IONode,
  PHIDGET: IONode,
  SERIAL: IONode,
  STATS: ScipyNode,
  SIGNAL: ScipyNode,
  LINALG: NumpyNode,
};
