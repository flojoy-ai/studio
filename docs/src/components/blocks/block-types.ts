import AIBlock, { type AICategory } from "./ai-block";
import MathBlock, { type MathCategory } from "./math-block";
import DSPBlock, { type DSPCategory } from "./dsp-block";
import DataBlock, { type DataCategory } from "./data-block";
import DebuggingBlock, { type DebuggingCategory } from "./debugging-block";
import DefaultBlock from "./default-block";
import HardwareBlock, { type HardwareCategory } from "./hardware-block";
import CtrlFlowBlock, { type CtrlFlowCategory } from "./ctrl-flow-block";
import NumpyBlock, { type NumpyCategory } from "./numpy-block";
import ScipyBlock, { type ScipyCategory } from "./scipy-block";
import TextNode from "./text-node";
import VisorBlock from "./visor-block";
import { type ComponentType } from "react";
import ETLBlock, { type ETLCategory } from "./etl-block";
import { type NodeProps } from "reactflow";

type BlockCategory =
  | AICategory
  | DataCategory
  | ETLCategory
  | MathCategory
  | DSPCategory
  | CtrlFlowCategory
  | HardwareCategory
  | DebuggingCategory
  | NumpyCategory
  | ScipyCategory
  | "TextNode"
  | "default";

type BlockTypesMap = {
  [key in BlockCategory]: ComponentType<NodeProps>;
};

const blockTypesMap: BlockTypesMap = {
  default: DefaultBlock,
  /**
   * AI section
   */
  AI_ML: AIBlock,
  /**
   * Data section
   */
  DATA: DataBlock,
  VISUALIZATION: VisorBlock,
  /**
   * Math section
   */
  MATH: MathBlock,
  /**
   * ETL section
   */
  TRANSFORM: ETLBlock,
  LOAD: ETLBlock,
  EXTRACT: ETLBlock,
  TYPE_CASTING: ETLBlock,
  /**
   * DSP section
   */
  DSP: DSPBlock,
  /**
   * Control Flow section
   */
  CONTROL_FLOW: CtrlFlowBlock,
  CONDITIONALS: CtrlFlowBlock,
  /**
   * Hardware section
   */
  HARDWARE: HardwareBlock,
  FUNCTION_GENERATORS: HardwareBlock,
  ROBOTICS: HardwareBlock,
  IMAGING: HardwareBlock,
  NATIONAL_INSTRUMENTS: HardwareBlock,
  MOTORS: HardwareBlock,
  PROTOCOLS: HardwareBlock,
  MULTIMETERS: HardwareBlock,
  DAQ_BOARDS: HardwareBlock,
  OSCILLOSCOPES: HardwareBlock,
  /**
   * Numpy section
   */
  NUMPY: NumpyBlock,
  /**
   * Scipy section
   */
  SCIPY: ScipyBlock,
  /**
   * Text section
   */
  TextNode: TextNode,
  /**
   * Debugging section
   */
  DEBUGGING: DebuggingBlock,
};
export default blockTypesMap;
