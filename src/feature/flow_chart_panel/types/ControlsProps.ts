import { Dispatch } from "react";
import { Elements, OnLoadParams } from "react-flow-renderer";

export type ControlsProps = {
  rfInstance?: OnLoadParams;
  setElements: Dispatch<React.SetStateAction<Elements<any>>>;
  clickedElement: Dispatch<React.SetStateAction<Elements<any>>>;
  onElementsRemove: Dispatch<React.SetStateAction<Elements<any>>>;
  theme: "light" | "dark";
  activeTab: "debug" | "panel" | "visual";
  isVisualMode?: boolean;
  setOpenCtrlModal: Dispatch<React.SetStateAction<boolean>>;
}