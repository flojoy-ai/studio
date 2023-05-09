export type NodeModalProps = {
  modalIsOpen: boolean;
  afterOpenModal: () => void;
  closeModal: () => void;
  modalStyles: ReactModal.Styles;
  nodeLabel: any;
  nodeType: any;
  nd: any;
  defaultLayout: any;
  clickedElement: any;
  pythonString: string;
};
