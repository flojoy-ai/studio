import { ResultIO } from "@src/feature/results_panel/types/ResultsType";

export type NodeModalProps = {
  modalIsOpen: boolean;
  closeModal: () => void;
  nodeLabel: any;
  nodeType: any;
  nd: ResultIO;
  clickedElement: any;
  pythonString: string;
};
