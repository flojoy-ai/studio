import { app, ipcRenderer } from "electron";
import * as fileSave from "./fileSave";
import { API } from "../types/api";
import { InterpretersList } from "../main/python/interpreter";
import { PoetryGroupInfo, PythonDependency } from "src/types/poetry";

export default {
  ...fileSave,
  setUnsavedChanges: (value: boolean) =>
    ipcRenderer.send(API.setUnsavedChanges, value),
  subscribeToElectronLogs: (func: (arg: string) => void) => {
    ipcRenderer.on(API.statusBarLogging, (event, data: string) => func(data));
  },
  checkPythonInstallation: (force?: boolean): Promise<InterpretersList> =>
    ipcRenderer.invoke(API.checkPythonInstallation, force),
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
  setPythonInterpreter: (interpreter: string): Promise<void> =>
    ipcRenderer.invoke(API.setPythonInterpreter, interpreter),
  browsePyInterpreter: (): Promise<string | null> =>
    ipcRenderer.invoke(API.browsePythonInterpreter),
  sendLogToStatusbar: (...log: string[]) =>
    ipcRenderer.send(API.sendLogToStatusbar, ...log),
  isPackaged: (): boolean => app.isPackaged,
  listPythonPackages: (): Promise<string> =>
    ipcRenderer.invoke(API.listPythonPackages),
  pyvisaInfo: (): Promise<string> => ipcRenderer.invoke(API.pyvisaInfo),
  ping: (addr: string): Promise<string> => ipcRenderer.invoke(API.ping, addr),
  netstat: (): Promise<string> => ipcRenderer.invoke(API.netstat),
  ifconfig: (): Promise<string> => ipcRenderer.invoke(API.ifconfig),
  pickDirectory: (): Promise<string> => ipcRenderer.invoke(API.pickDirectory),
  downloadLogs: (): void => ipcRenderer.send(API.downloadLogs),
  checkForUpdates: (): void => ipcRenderer.send(API.checkForUpdates),
  restartCaptain: (): Promise<void> => ipcRenderer.invoke(API.restartCaptain),
  getCustomBlocksDir: (): Promise<string | undefined> =>
    ipcRenderer.invoke(API.getCustomBlocksDir),
  cacheCustomBlocksDir: (dirPath: string): void =>
    ipcRenderer.send(API.cacheCustomBlocksDir, dirPath),

  poetryShowTopLevel: (): Promise<PythonDependency[]> =>
    ipcRenderer.invoke(API.poetryShowTopLevel),
  poetryGetGroupInfo: (): Promise<PoetryGroupInfo[]> =>
    ipcRenderer.invoke(API.poetryGetGroupInfo),
  poetryInstallDepGroup: (group: string): Promise<boolean> =>
    ipcRenderer.invoke(API.poetryInstallDepGroup, group),
  poetryUninstallDepGroup: (group: string): Promise<boolean> =>
    ipcRenderer.invoke(API.poetryUninstallDepGroup, group),

  openFilePicker: (): Promise<{ filePath: string; fileContent: string }> =>
    ipcRenderer.invoke(API.openFilePicker),

  openEditorWindow: (filepath: string): Promise<void> =>
    ipcRenderer.invoke(API.openEditorWindow, filepath),

  loadFileFromFullPath: (filepath: string): Promise<string> =>
    ipcRenderer.invoke(API.loadFileFromFullPath, filepath),

  saveFileToFullPath: (
    filepath: string,
    fileContent: string,
  ): Promise<boolean> =>
    ipcRenderer.invoke(API.saveFileToFullPath, filepath, fileContent),
  getSetupExecutionTime: (): Promise<number> =>
    ipcRenderer.invoke(API.setupExecutionTime),

  isCI: (): Promise<boolean> => ipcRenderer.invoke(API.isCI),
  getAllLogs: (): Promise<string> => ipcRenderer.invoke(API.getAllLogs),
};
