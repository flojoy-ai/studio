import { ResultIO } from "@src/feature/results_panel/types/ResultsType";

export type NodeModalProps = {
  modalIsOpen: boolean;
  afterOpenModal: () => void;
  closeModal: () => void;
  nodeLabel: any;
  nodeType: any;
  nd: ResultIO;
  defaultLayout: any;
  clickedElement: any;
  pythonString: string;
}; 
