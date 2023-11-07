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
  updateBlocksPack: () => {
    ipcRenderer.send("update-blocks-pack");
  },
  updateBlocksResourcePath: () => {
    ipcRenderer.send("change-blocks-resource-path");
  },
};
