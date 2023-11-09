import { ipcRenderer } from "electron";
import * as fileSave from "./fileSave";
import { API } from "src/types/api";

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
  saveBlocks: () => ipcRenderer.invoke(API.saveBlocks),
  updateBlocks: () => ipcRenderer.invoke(API.updateBlocks),
  changeBlocksPath: () => ipcRenderer.invoke(API.changeBlocksPath),
  checkPythonInstallation: (): Promise<string> =>
    ipcRenderer.invoke("check-python-installation"),
  installPipx: (): Promise<string> => ipcRenderer.invoke("install-pipx"),
  pipxEnsurepath: (): Promise<void> => ipcRenderer.invoke("pipx-ensurepath"),
  installPoetry: (): Promise<string> => ipcRenderer.invoke("install-poetry"),
  installDependencies: (): Promise<string> =>
    ipcRenderer.invoke("install-dependencies"),
  getPoetryVenvExecutable: (): Promise<string> =>
    ipcRenderer.invoke("get-poetry-venv-executable"),
  spawnCaptain: (): Promise<void> => ipcRenderer.invoke("spawn-captain"),
  killCaptain: (): Promise<string> => ipcRenderer.invoke("kill-captain"),
  openLogFolder: (): Promise<void> => ipcRenderer.invoke("open-log-folder"),
  restartFlojoyStudio: (): Promise<void> =>
    ipcRenderer.invoke("restart-flojoy-studio"),
};
