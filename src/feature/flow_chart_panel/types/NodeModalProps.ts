import { ResultIO } from "@src/feature/results_panel/types/ResultsType";
import { Node } from "reactflow";
import { ElementsData } from "./CustomNodeProps";

export type NodeModalProps = {
  modalIsOpen: boolean;
  closeModal: () => void;
  nodeLabel: string;
  nodeType: string;
  nd: ResultIO | null;
  pythonString: string;
  nodeFilePath: string;
  selectedNode: Node<ElementsData> | null;
};
