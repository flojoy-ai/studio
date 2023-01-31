import { NodeOnAddFunc } from "./NodeAddFunc";

export interface AddNodeModalProps {
  modalIsOpen: boolean;
  afterOpenModal: () => void;
  closeModal: () => void;
  onAdd: NodeOnAddFunc;
  theme: "light" | "dark";
}