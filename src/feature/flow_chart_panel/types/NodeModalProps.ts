import { ResultIO } from "@src/feature/results_panel/types/ResultsType";

export type NodeModalProps = {
  modalIsOpen: boolean;
  afterOpenModal: () => void;
  closeModal: () => void;
  modalStyles: ReactModal.Styles;
  nodeLabel: any;
  nodeType: any;
  nd: ResultIO;
  defaultLayout: any;
  clickedElement: any;
  pythonString: string;
};
