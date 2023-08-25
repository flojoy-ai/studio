import { ipcRenderer } from "electron";
import * as fileSave from "./fileSave";

export default {
  ...fileSave,
  setUnsavedChanges: (value: boolean) =>
    ipcRenderer.send("set-unsaved-changes", value),
};
