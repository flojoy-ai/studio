import { ResultIO } from "@src/feature/results_panel/types/ResultsType";

export interface NodeModalProps {
  modalIsOpen: boolean;
  afterOpenModal: () => void;
  closeModal: () => void;
  modalStyles: ReactModal.Styles;
  nodeLabel: any;
  nodeType: any;
  nd: ResultIO;
  defaultLayout: any;
  theme: "dark" | "light";
  clickedElement: any;
  pythonString: String;
}
