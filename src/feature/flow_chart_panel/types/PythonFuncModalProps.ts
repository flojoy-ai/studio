import { NodeOnAddFunc } from "./NodeAddFunc";

export interface PythonFuncModalProps {
  modalIsOpen: boolean;
  afterOpenModal: () => void;
  closeModal: () => void;
  onAdd: NodeOnAddFunc;
  theme: "light" | "dark";
}