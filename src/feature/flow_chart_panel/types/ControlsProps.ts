import { Dispatch } from "react";
import { Elements, FlowExportObject } from "react-flow-renderer";

export type ControlsProps = {
  theme: "light" | "dark";
  activeTab: "debug" | "panel" | "visual";
  setOpenCtrlModal: Dispatch<React.SetStateAction<boolean>>;
}