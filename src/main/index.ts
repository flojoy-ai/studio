import { app, BrowserWindow, ipcMain, dialog, shell } from "electron";
import contextMenu from "electron-context-menu";
import { release } from "node:os";
import { checkForUpdates } from "./update";
import log from "electron-log/main";
import { API } from "../types/api";
import {
  checkPythonInstallation,
  installDependencies,
  installPipx,
  installPoetry,
  killCaptain,
  listPythonPackages,
  pipxEnsurepath,
  pyvisaInfo,
  restartCaptain,
  spawnCaptain,
} from "./python";
import {
  getAllLogs,
  handleDownloadLogs,
  logListener,
  openLogFolder,
  sendToStatusBar,
} from "./logging";
import {
  cacheCustomBlocksDir,
  getCustomBlocksDir,
  ifconfig,
  netstat,
  pickDirectory,
  ping,
  openFilePicker,
  writeFileSync,
  cleanup,
  loadFileFromFullPath,
  saveFileToFullPath,
} from "./utils";
import {
  browsePythonInterpreter,
  handlePythonInterpreter,
} from "./python/interpreter";
import {
  poetryGetGroupInfo,
  poetryInstallDepGroup,
  poetryShowTopLevel,
  poetryUninstallDepGroup,
} from "./python/poetry";
import { createEditorWindow, createWindow } from "./window";
import {
  getUsers,
  setUserProfile,
  setUserProfilePassword,
  validatePassword,
} from "../api/services/auth-service";

log.initialize({ preload: true });
log.info("Welcome to Flojoy Studio!");
process.env.ELECTRON_MODE = app.isPackaged ? "packaged" : "dev";

// The built directory structure
//
// ├─┬ out
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ renderer
// │ └── index.html    > Electron-Renderer
//
const envPath = process.env.PATH ?? "";

if (!envPath.split(":").includes("usr/local/bin")) {
  process.env.PATH = [...envPath.split(":"), "usr/local/bin"].join(":");
}

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

const handleSetUnsavedChanges = (_, value: boolean) => {
  global.hasUnsavedChanges = value;
};

const handleShowSaveAsDialog = async (_, defaultFilename: string) => {
  return await dialog.showSaveDialog({
    defaultPath: defaultFilename,
    filters: [
      {
        name: "json",
        extensions: ["json"],
      },
    ],
  });
};

// Remove electron security warnings
// This warning only shows in development mode
// Read more on https://www.electronjs.org/docs/latest/tutorial/security
// process.env['ELECTRON_DISABLE_SECURITY_WARNINGS'] = 'true'

contextMenu({
  showSaveImageAs: true,
  prepend() {
    return [
      {
        label: "Reload Studio",
        visible: true,
        click(_, browserWindow) {
          browserWindow?.webContents.reload();
        },
      },
    ];
  },
});

app.setName("Flojoy Studio");

app.whenReady().then(async () => {
  createWindow().catch((err) => console.log(err));
  ipcMain.on(API.setUnsavedChanges, handleSetUnsavedChanges);
  ipcMain.on(API.writeFileSync, writeFileSync);
  ipcMain.on(API.statusBarLogging, logListener);
  ipcMain.on(API.sendLogToStatusbar, (_, ...logs) =>
    sendToStatusBar(logs.join(" ")),
  );
  ipcMain.on(API.downloadLogs, handleDownloadLogs);
  ipcMain.on(API.checkForUpdates, checkForUpdates);
  ipcMain.on(API.cacheCustomBlocksDir, cacheCustomBlocksDir);
  ipcMain.handle(API.setupExecutionTime, async () => {
    const end = performance.now();
    const executionTimeInSeconds = (end - global.setupStarted) / 1000;
    return await Promise.resolve(executionTimeInSeconds);
  });
  ipcMain.handle(API.isCI, () => {
    return Promise.resolve(process.env.CI === "true");
  });
  ipcMain.handle(API.getAllLogs, getAllLogs);
  ipcMain.handle(API.getCustomBlocksDir, getCustomBlocksDir);
  ipcMain.handle(API.restartCaptain, restartCaptain);
  ipcMain.handle(API.setPythonInterpreter, handlePythonInterpreter);
  ipcMain.handle(API.showSaveDialog, handleShowSaveAsDialog);
  ipcMain.handle(API.checkPythonInstallation, checkPythonInstallation);
  ipcMain.handle(API.installPipx, installPipx);
  ipcMain.handle(API.pipxEnsurepath, pipxEnsurepath);
  ipcMain.handle(API.installPoetry, installPoetry);
  ipcMain.handle(API.installDependencies, installDependencies);
  ipcMain.handle(API.spawnCaptain, spawnCaptain);
  ipcMain.handle(API.killCaptain, killCaptain);
  ipcMain.handle(API.openLogFolder, openLogFolder);
  ipcMain.handle(API.pickDirectory, pickDirectory);
  ipcMain.handle(API.browsePythonInterpreter, browsePythonInterpreter);
  ipcMain.handle(API.listPythonPackages, listPythonPackages);
  ipcMain.handle(API.pyvisaInfo, pyvisaInfo);
  ipcMain.handle(API.ping, (_, addr) => ping(addr));
  ipcMain.handle(API.netstat, netstat);
  ipcMain.handle(API.ifconfig, ifconfig);
  ipcMain.handle(API.restartFlojoyStudio, () => {
    app.relaunch();
    app.exit();
  });

  ipcMain.handle(API.poetryShowTopLevel, poetryShowTopLevel);
  ipcMain.handle(API.poetryGetGroupInfo, poetryGetGroupInfo);
  ipcMain.handle(API.poetryInstallDepGroup, (_, group) => {
    return poetryInstallDepGroup(group);
  });
  ipcMain.handle(API.poetryUninstallDepGroup, (_, group) => {
    return poetryUninstallDepGroup(group);
  });
  ipcMain.handle(API.openFilePicker, openFilePicker);
  ipcMain.handle(API.openEditorWindow, (_, filepath) => {
    createEditorWindow(filepath);
  });

  ipcMain.handle(API.loadFileFromFullPath, (_, filepath) => {
    return loadFileFromFullPath(filepath);
  });

  ipcMain.handle(API.saveFileToFullPath, (_, filepath, fileContent) => {
    return saveFileToFullPath(filepath, fileContent);
  });
  ipcMain.handle(API.openLink, (_, url) => {
    shell.openExternal(url);
  });
  // Authentication
  ipcMain.handle(API.getUserProfiles, async () => {
    return Promise.resolve(getUsers());
  });
  ipcMain.on(API.setUserProfile, setUserProfile);
  ipcMain.handle(API.setUserProfilePassword, setUserProfilePassword);
  ipcMain.handle(API.validatePassword, validatePassword);
});

app.on("window-all-closed", async () => {
  log.info("window-all-closed fired!");
  ipcMain.removeListener(API.statusBarLogging, logListener);
  await cleanup();
  if (process.platform !== "darwin") {
    app.exit(0);
  }
});

app.on("before-quit", async (e) => {
  e.preventDefault();
  mainWindow.removeAllListeners("close");
  log.info("before-quit fired!");
  await cleanup();
  app.exit(0);
});

app.on("second-instance", () => {
  if (global.mainWindow) {
    // Focus on the main window if the user tried to open another
    if (global.mainWindow.isMinimized()) global.mainWindow.restore();
    global.mainWindow.focus();
  }
});

app.on("activate", () => {
  const allWindows = BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
