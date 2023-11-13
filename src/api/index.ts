import { ipcRenderer } from "electron";
import * as fileSave from "./fileSave";
import { API } from "../types/api";
import { InterpretersList } from "../main/python/interpreter";

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
    ipcRenderer.send(API.setUnsavedChanges, value),
  subscribeToElectronLogs: (func: (arg: string) => void) => {
    ipcRenderer.on(API.statusBarLogging, (event, data: string) => func(data));
  },
  saveBlocks: () => ipcRenderer.invoke(API.saveBlocks),
  updateBlocks: () => ipcRenderer.invoke(API.updateBlocks),
  changeBlocksPath: () => ipcRenderer.invoke(API.changeBlocksPath),
  checkPythonInstallation: (): Promise<InterpretersList> =>
    ipcRenderer.invoke(API.checkPythonInstallation),
  installPipx: (): Promise<string> => ipcRenderer.invoke(API.installPipx),
  pipxEnsurepath: (): Promise<void> => ipcRenderer.invoke(API.pipxEnsurepath),
  installPoetry: (): Promise<string> => ipcRenderer.invoke(API.installPoetry),
  installDependencies: (): Promise<string> =>
    ipcRenderer.invoke(API.installDependencies),
  getPoetryVenvExecutable: (): Promise<string> =>
    ipcRenderer.invoke(API.getPoetryVenvExecutable),
  spawnCaptain: (): Promise<void> => ipcRenderer.invoke(API.spawnCaptain),
  killCaptain: (): Promise<string> => ipcRenderer.invoke(API.killCaptain),
  openLogFolder: (): Promise<void> => ipcRenderer.invoke(API.openLogFolder),
  restartFlojoyStudio: (): Promise<void> =>
    ipcRenderer.invoke(API.restartFlojoyStudio),
  setPythonInterpreter: (interpreter: string) =>
    ipcRenderer.send(API.setPythonInterpreter, interpreter),
};
