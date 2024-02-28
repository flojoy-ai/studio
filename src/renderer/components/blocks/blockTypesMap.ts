import AIBlock from "./AIBlock";
import ArithmeticNode from "./ArithmeticNode";
import ConditionalNode from "./ConditionalNode";
import DSPBlock from "./DSPBlock";
import DataNode from "./DataNode";
import DebuggingBlock from "./DebuggingBlock";
import DefaultNode from "./DefaultNode";
import IONode from "./IONode";
import LogicNode from "./LogicNode";
import NumpyNode from "./NumpyNode";
import ScipyNode from "./ScipyNode";
import TextNode from "./TextNode";
import VisorNode from "./VisorNode";

export default {
  default: DefaultNode,
  AI_ML: AIBlock,
  GENERATORS: DataNode,
  VISUALIZERS: VisorNode,
  EXTRACTORS: DefaultNode,
  TRANSFORMERS: DefaultNode,
  LOADERS: DefaultNode,
  ARITHMETIC: ArithmeticNode,
  IO: IONode,
  LOGIC_GATES: LogicNode,
  CONDITIONALS: ConditionalNode,
  SCIPY: ScipyNode,
  NUMPY: NumpyNode,
  DATA: DataNode,
  VISUALIZATION: VisorNode,
  ETL: DefaultNode,
  DSP: DSPBlock,
  CONTROL_FLOW: LogicNode,
  MATH: DefaultNode,
  HARDWARE: IONode,
  TextNode: TextNode,
  DEBUGGING: DebuggingBlock,
};
