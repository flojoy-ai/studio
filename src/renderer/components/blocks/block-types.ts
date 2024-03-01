import { NodeTypes } from "reactflow";
import AIBlock from "./ai-block";
import ArithmeticBlock from "./arithmetic-block";
import ConditionalNode from "./conditional-block";
import DSPBlock from "./dsp-block";
import DataNode from "./data-block";
import DebuggingBlock from "./debugging-block";
import DefaultBlock from "./default-block";
import ExtractBlock from "./etl/extract-block";
import HardwareBlock from "./hardware/hardware-block";
import LogicBlock from "./logic-block";
import NumpyNode from "./NumpyNode";
import ScipyNode from "./ScipyNode";
import TextNode from "./TextNode";
import TypeCastingBlock from "./etl/type-casting-block";
import VisorBlock from "./visor-block";
import LoadBlock from "./etl/load-block";
import FnGeneratorBlock from "./hardware/fn-generator-block";
import RoboticBlock from "./hardware/robotic-block";

const blockTypesMap: NodeTypes = {
  default: DefaultBlock,
  AI_ML: AIBlock,
  GENERATORS: DataNode,
  VISUALIZERS: VisorBlock,
  EXTRACTORS: DefaultBlock,
  TRANSFORM: DefaultBlock,
  LOAD: LoadBlock,
  ARITHMETIC: ArithmeticBlock,
  IO: HardwareBlock,
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
  HARDWARE: HardwareBlock,
  TextNode: TextNode,
  DEBUGGING: DebuggingBlock,
  EXTRACT: ExtractBlock,
  TYPE_CASTING: TypeCastingBlock,
  FUNCTION_GENERATORS: FnGeneratorBlock,
  ROBOTICS: RoboticBlock,
};
export default blockTypesMap;
