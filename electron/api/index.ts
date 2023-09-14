import { ipcRenderer } from "electron";
import * as fileSave from "./fileSave";

export type CallBackArgs =
  | {
      open: boolean;
      title?: string;
      description?: string;
      output: string;
      clear?: boolean;
    }
  | string;

export default {
  ...fileSave,
  setUnsavedChanges: (value: boolean) =>
    ipcRenderer.send("set-unsaved-changes", value),
  subscribeToElectronLogs: (func: (arg: CallBackArgs) => void) => {
    ipcRenderer.on("electron-log", (event, args: CallBackArgs) => func(args));
  },
  updateNodesPack: () => {
    ipcRenderer.send("update-nodes-pack");
  },
  updateNodesResourcePath: () => {
    ipcRenderer.send("update-nodes-resource-path");
  },
};
