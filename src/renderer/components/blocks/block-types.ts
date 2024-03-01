import { NodeTypes } from "reactflow";
import AIBlock from "./ai-block";
import ArithmeticBlock from "./arithmetic-block";
import ConditionalNode from "./conditional-block";
import DSPBlock from "./dsp-block";
import DataNode from "./data-block";
import DebuggingBlock from "./debugging-block";
import DefaultBlock from "./default-block";
import ExtractBlock from "./extract-block";
import IONode from "./IONode";
import LogicBlock from "./logic-block";
import NumpyNode from "./NumpyNode";
import ScipyNode from "./ScipyNode";
import TextNode from "./TextNode";
import TypeCastingBlock from "./type-casting-block";
import VisorBlock from "./visor-block";

const blockTypesMap: NodeTypes = {
  default: DefaultBlock,
  AI_ML: AIBlock,
  GENERATORS: DataNode,
  VISUALIZERS: VisorBlock,
  EXTRACTORS: DefaultBlock,
  TRANSFORM: DefaultBlock,
  LOADERS: DefaultBlock,
  ARITHMETIC: ArithmeticBlock,
  IO: IONode,
  LOGIC_GATES: LogicBlock,
  CONDITIONALS: ConditionalNode,
  SCIPY: ScipyNode,
  NUMPY: NumpyNode,
  DATA: DataNode,
  VISUALIZATION: VisorBlock,
  ETL: DefaultBlock,
  DSP: DSPBlock,
  CONTROL_FLOW: LogicBlock,
  MATH: DefaultBlock,
  HARDWARE: IONode,
  TextNode: TextNode,
  DEBUGGING: DebuggingBlock,
  EXTRACT: ExtractBlock,
  TYPE_CASTING: TypeCastingBlock,
};
export default blockTypesMap;
