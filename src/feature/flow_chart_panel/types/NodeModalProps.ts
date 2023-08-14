import { NodeResult } from "@src/feature/common/types/ResultsType";
import { Node } from "reactflow";
import { ElementsData } from "@/types";

export type NodeModalProps = {
  modalIsOpen: boolean;
  closeModal: () => void;
  nodeLabel: string;
  nodeType: string;
  nd: NodeResult | null;
  pythonString: string;
  nodeFilePath: string;
  selectedNode: Node<ElementsData> | null;
};
