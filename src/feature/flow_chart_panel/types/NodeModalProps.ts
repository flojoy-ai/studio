export interface NodeModalProps {
  modalIsOpen: boolean;
  afterOpenModal: () => void;
  closeModal: () => void;
  modalStyles: ReactModal.Styles;
  nodeLabel: any;
  nodeType: any;
  nd: any;
  defaultLayout: any;
  theme: "dark" | "light";
  clickedElement: any;
  pythonString: String;
}
