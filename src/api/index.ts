import { app, ipcRenderer } from "electron";
import * as fileSave from "./fileSave";
import { InterpretersList } from "@/main/python/interpreter";
import { PoetryGroupInfo, PythonDependency } from "src/types/poetry";
import { ResultAsync, fromPromise } from "neverthrow";
import type { User } from "@/types/auth";
import path from "path";

export const API = {
  checkPythonInstallation: "CHECK_PYTHON_INSTALLATION",
  installPipx: "INSTALL_PIPX",
  pipxEnsurepath: "PIPX_ENSUREPATH",
  installPoetry: "INSTALL_POETRY",
  installDependencies: "INSTALL_DEPENDENCIES",
  getPoetryVenvExecutable: "GET_POETRY_EXECUTABLE",
  spawnCaptain: "SPAWN_CAPTAIN",
  killCaptain: "KILL_CAPTAIN",
  openLogFolder: "OPEN_LOG_FOLDER",
  restartFlojoyStudio: "RESTART_STUDIO",
  setUnsavedChanges: "SET_UNSAVED_CHANGES",
  statusBarLogging: "STATUSBAR_LOGGING",
  setPythonInterpreter: "SET_PY_INTERPRETER",
  writeFileSync: "WRITE_FILE_SYNC",
  writeFile: "WRITE_FILE",
  showSaveDialog: "SHOW_SAVE_DIALOG",
  browsePythonInterpreter: "BROWSE_PY_INTERPRETER",
  sendLogToStatusbar: "SEND_LOG_TO_STATUSBAR",
  listPythonPackages: "LIST_PYTHON_PACKAGES",
  pyvisaInfo: "PYVISA_INFO",
  ping: "PING",
  netstat: "NETSTAT",
  ifconfig: "IFCONFIG",
  downloadLogs: "DOWNLOAD_LOGS",
  checkForUpdates: "CHECK_FOR_UPDATES",
  restartCaptain: "RESTART_CAPTAIN",
  pickDirectory: "PICK_DIRECTORY",
  getCustomBlocksDir: "GET_CUSTOM_BLOCKS_DIR",
  cacheCustomBlocksDir: "CACHE_CUSTOM_BLOCKS_DIR",
  poetryShowTopLevel: "POETRY_SHOW_TOP_LEVEL",
  poetryShowUserGroup: "POETRY_SHOW_USER_GROUP",
  poetryGetGroupInfo: "POETRY_GET_GROUP_INFO",
  poetryInstallDepGroup: "POETRY_INSTALL_DEP_GROUP",
  poetryInstallDepUserGroup: "POETRY_INSTALL_DEP_USER_GROUP",
  poetryUninstallDepUserGroup: "POETRY_UNINSTALL_DEP_USER_GROUP",
  poetryUninstallDepGroup: "POETRY_UNINSTALL_DEP_GROUP",
  poetryInstallRequirementsUserGroup: "POETRY_INSTALL_REQUIREMENTS_USER_GROUP",
  openFilePicker: "OPEN_FILE_PICKER",
  openFilesPicker: "OPEN_FILES_PICKER",
  openAllFilesInFolderPicker: "OPEN_ALL_FILES_IN_FOLDER_PICKER",
  getFileContent: "GET_FILE_CONTENT",
  isFileOnDisk: "IS_FILE_ON_DISK",
  openEditorWindow: "OPEN_EDITOR_WINDOW",
  loadFileFromFullPath: "LOAD_FILE_FROM_FULL_PATH",
  saveFileToFullPath: "SAVE_FILE_TO_FULL_PATH",
  setupExecutionTime: "SETUP_EXEC_TIME",
  isCI: "IS_CI",
  isDev: "IS_DEV",
  getAllLogs: "GET_ALL_LOGS",
  openLink: "OPEN_LINK",
  openTestPicker: "OPEN_TEST_PICKER",
  // Authentication
  getUserProfiles: "GET_USER_PROFILES",
  setUserProfile: "SET_USER_PROFILE",
  setUserProfilePassword: "SET_USER_PROFILE_PASSWORD",
  validatePassword: "VALIDATE_PASSWORD",
  createUserProfile: "CREATE_USER_PROFILE",
  deleteUserProfile: "DELETE_USER_PROFILE",
} as const;

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
  pickDirectory: (allowDirectoryCreation: boolean): Promise<string> =>
    ipcRenderer.invoke(API.pickDirectory, allowDirectoryCreation),
  downloadLogs: (): void => ipcRenderer.send(API.downloadLogs),
  checkForUpdates: (): void => ipcRenderer.send(API.checkForUpdates),
  restartCaptain: (): Promise<void> => ipcRenderer.invoke(API.restartCaptain),
  getCustomBlocksDir: (): Promise<string | undefined> =>
    ipcRenderer.invoke(API.getCustomBlocksDir),
  cacheCustomBlocksDir: (dirPath: string): void =>
    ipcRenderer.send(API.cacheCustomBlocksDir, dirPath),

  poetryShowTopLevel: (): Promise<PythonDependency[]> =>
    ipcRenderer.invoke(API.poetryShowTopLevel),
  poetryShowUserGroup: (): Promise<PythonDependency[]> =>
    ipcRenderer.invoke(API.poetryShowUserGroup),
  poetryGetGroupInfo: (): Promise<PoetryGroupInfo[]> =>
    ipcRenderer.invoke(API.poetryGetGroupInfo),
  poetryInstallDepGroup: (group: string): Promise<boolean> =>
    ipcRenderer.invoke(API.poetryInstallDepGroup, group),
  poetryUninstallDepGroup: (group: string): Promise<boolean> =>
    ipcRenderer.invoke(API.poetryUninstallDepGroup, group),
  poetryInstallDepUserGroup: (dep: string): Promise<boolean> =>
    ipcRenderer.invoke(API.poetryInstallDepUserGroup, dep),
  poetryInstallRequirementsUserGroup: (filePath: string): Promise<boolean> =>
    ipcRenderer.invoke(API.poetryInstallRequirementsUserGroup, filePath),
  poetryUninstallDepUserGroup: (dep: string): Promise<boolean> =>
    ipcRenderer.invoke(API.poetryUninstallDepUserGroup, dep),

  openTestPicker: (): Promise<{ filePath: string; fileContent: string }> =>
    ipcRenderer.invoke(API.openTestPicker),

  isFileOnDisk: (filepath: string): Promise<boolean> =>
    ipcRenderer.invoke(API.isFileOnDisk, filepath),

  openFilePicker: (
    allowedExtensions: string[] = ["json"],
  ): Promise<{ filePath: string; fileContent: string } | undefined> =>
    ipcRenderer.invoke(API.openFilePicker, allowedExtensions),

  openFilesPicker: (
    allowedExtensions: string[] = ["json"],
    title: string = "Select Files",
  ): Promise<{ filePath: string; fileContent: string }[] | undefined> =>
    ipcRenderer.invoke(API.openFilesPicker, allowedExtensions, title),

  openAllFilesInFolderPicker: (
    allowedExtensions: string[] = ["json"],
    title: string = "Select Folder",
  ): Promise<{ filePath: string; fileContent: string }[] | undefined> =>
    ipcRenderer.invoke(
      API.openAllFilesInFolderPicker,
      allowedExtensions,
      title,
    ),

  getFileContent: (filepath: string): Promise<string> =>
    ipcRenderer.invoke(API.getFileContent, filepath),

  getPathSeparator: () => path.sep,

  openEditorWindow: (filepath: string): Promise<void> =>
    ipcRenderer.invoke(API.openEditorWindow, filepath),

  loadFileFromFullPath: (filepath: string): Promise<string> =>
    ipcRenderer.invoke(API.loadFileFromFullPath, filepath),

  saveFileToFullPath: (
    filepath: string,
    fileContent: string,
  ): ResultAsync<void, Error> =>
    fromPromise(
      ipcRenderer.invoke(API.saveFileToFullPath, filepath, fileContent),
      (e) => e as Error,
    ),

  getSetupExecutionTime: (): Promise<number> =>
    ipcRenderer.invoke(API.setupExecutionTime),

  isCI: (): Promise<boolean> => ipcRenderer.invoke(API.isCI),
  isDev: (): Promise<boolean> => ipcRenderer.invoke(API.isDev),
  getAllLogs: (): Promise<string> => ipcRenderer.invoke(API.getAllLogs),
  openLink: (url: string): Promise<void> =>
    ipcRenderer.invoke(API.openLink, url),

  getUserProfiles: (): Promise<User[]> =>
    ipcRenderer.invoke(API.getUserProfiles),

  setUserProfile: (username: string): void => {
    ipcRenderer.send(API.setUserProfile, username);
  },
  setUserProfilePassword: (username: string, password: string): Promise<void> =>
    ipcRenderer.invoke(API.setUserProfilePassword, username, password),
  validatePassword: (username: string, password: string): Promise<boolean> =>
    ipcRenderer.invoke(API.validatePassword, username, password),
  createUserProfile: (user: User) =>
    ipcRenderer.invoke(API.createUserProfile, user),
  deleteUserProfile: (username: string, currentUser: User): Promise<void> =>
    ipcRenderer.invoke(API.deleteUserProfile, username, currentUser),
};
