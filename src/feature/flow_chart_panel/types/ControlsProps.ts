import { Dispatch } from "react";

export type ControlsProps = {
  theme: "light" | "dark";
  activeTab: "debug" | "panel" | "visual";
  setOpenCtrlModal: Dispatch<React.SetStateAction<boolean>>;
}