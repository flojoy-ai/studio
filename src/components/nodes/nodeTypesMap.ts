import ArithmeticNode from "./ArithmeticNode";
import ConditionalNode from "./ConditionalNode";
import DataNode from "./DataNode";
import DefaultNode from "./DefaultNode";
import IONode from "./IONode";
import LogicNode from "./LogicNode";
import NumpyNode from "./NumpyNode";
import ScipyNode from "./ScipyNode";
import VisorNode from "./VisorNode";

export const nodeTypesMap = {
  default: DefaultNode,
  AI_ML: DataNode,
  GENERATORS: DataNode,
  VISUALIZERS: VisorNode,
  EXTRACTORS: DefaultNode,
  TRANSFORMERS: DefaultNode,
  LOADERS: DefaultNode,
  ARITHMETIC: ArithmeticNode,
  INSTRUMENTS: IONode,
  LOGIC_GATES: LogicNode,
  CONDITIONALS: ConditionalNode,
  SCIPY: ScipyNode,
  NUMPY: NumpyNode,
};
