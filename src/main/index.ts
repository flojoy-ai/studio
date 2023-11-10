import {
  app,
  BrowserWindow,
  shell,
  ipcMain,
  nativeImage,
  dialog,
} from "electron";
import contextMenu from "electron-context-menu";
import { release } from "node:os";
import { join } from "node:path";
import { update } from "./update";
import { saveBlocksPack } from "./blocks";
import fs from "fs";
import { ChildProcess } from "node:child_process";
import log from "electron-log/main";
import { API } from "../types/api";
import {
  checkPythonInstallation,
  installDependencies,
  installPipx,
  installPoetry,
  killCaptain,
  pipxEnsurepath,
  spawnCaptain,
} from "./python";
import { logListener, openLogFolder } from "./logging";
import { isPortFree, killProcess } from "./utils";

log.initialize({ preload: true });
log.info("Welcome to Flojoy Studio!");
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
const WORKING_DIR = join(__dirname, "../../");
const DIST_ELECTRON = join(WORKING_DIR, "out");
const PUBLIC_DIR = join(WORKING_DIR, app.isPackaged ? "../public" : "public");

// Disable GPU Acceleration for Windows 7
if (release().startsWith("6.1")) app.disableHardwareAcceleration();

// Set application name for Windows 10+ notifications
if (process.platform === "win32") app.setAppUserModelId(app.getName());

if (!app.requestSingleInstanceLock()) {
  app.quit();
  process.exit(0);
}

const getIcon = () => {
  switch (process.platform) {
    case "win32":
      return join(PUBLIC_DIR, "favicon.ico");
    case "linux":
      return join(PUBLIC_DIR, "favicon.png");
    default:
      return join(PUBLIC_DIR, "favicon.png");
  }
};

const handleSetUnsavedChanges = (_, value: boolean) => {
  global.hasUnsavedChanges = value;
};

const handleWriteFileSync = (_, path: string, data: string) => {
  fs.writeFileSync(path, data);
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

global.runningProcesses = [];

// Here, you can also use other preload
const preload = join(__dirname, `../preload/index.js`);

const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(DIST_ELECTRON, "renderer", "index.html");

app.setName("Flojoy Studio");

async function createWindow() {
  const mainWindow = new BrowserWindow({
    title: "Flojoy Studio",
    icon: getIcon(),
    autoHideMenuBar: app.isPackaged,
    webPreferences: {
      preload,
      sandbox: false,
    },
    show: false,
  });
  global.mainWindow = mainWindow;
  global.hasUnsavedChanges = true;

  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
    mainWindow.maximize();
  });
  // setting icon for mac
  if (process.platform === "darwin") {
    app.dock.setIcon(nativeImage.createFromPath(getIcon()));
  }
  if (!(await isPortFree(5392))) {
    const choice = dialog.showMessageBoxSync(global.mainWindow, {
      type: "question",
      buttons: ["Exit", "Kill Process"],
      title: "Existing Server Detected",
      message:
        "Seems like there is already a Flojoy server running! Do you want to kill it?",
      icon: getIcon(),
    });
    if (choice == 0) {
      mainWindow.destroy();
      app.quit();
      process.exit(0);
    } else {
      await killProcess(5392);
    }
  }
  if (!app.isPackaged && process.env["ELECTRON_RENDERER_URL"]) {
    await mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    await mainWindow.loadFile(indexHtml);
  }

  mainWindow.on("close", (e) => {
    if (!global.hasUnsavedChanges) {
      return;
    }
    const choice = dialog.showMessageBoxSync(mainWindow!, {
      type: "question",
      buttons: ["Yes", "No, go back"],
      title: "Quit?",
      message:
        "You have unsaved changes. Are you sure you want to quit Flojoy Studio?",
    });
    if (choice > 0) e.preventDefault();
  });

  // Make all links open with the browser, not with the application
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });

  // Apply electron-updater
  update(cleanup);
}

app.whenReady().then(async () => {
  createWindow().catch((err) => console.log(err));
  ipcMain.on(API.setUnsavedChanges, handleSetUnsavedChanges);
  ipcMain.on("write-file-sync", handleWriteFileSync);
  ipcMain.handle("show-save-as-dialog", handleShowSaveAsDialog);

  ipcMain.on(API.statusBarLogging, logListener);
  ipcMain.handle(API.saveBlocks, () =>
    saveBlocksPack({ win: mainWindow, icon: getIcon(), startup: true }),
  );
  ipcMain.handle(API.updateBlocks, () =>
    saveBlocksPack({ win: global.mainWindow, icon: getIcon(), update: true }),
  );
  ipcMain.handle(API.changeBlocksPath, () =>
    saveBlocksPack({ win: global.mainWindow, icon: getIcon() }),
  );
  ipcMain.handle(API.checkPythonInstallation, checkPythonInstallation);
  ipcMain.handle(API.installPipx, installPipx);
  ipcMain.handle(API.pipxEnsurepath, pipxEnsurepath);
  ipcMain.handle(API.installPoetry, installPoetry);
  ipcMain.handle(API.installDependencies, installDependencies);
  ipcMain.handle(API.spawnCaptain, spawnCaptain);
  ipcMain.handle(API.killCaptain, killCaptain);
  ipcMain.handle(API.openLogFolder, openLogFolder);
  ipcMain.handle(API.restartFlojoyStudio, () => {
    app.relaunch();
    app.exit();
  });
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

// New window example arg: new windows url
ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new BrowserWindow({
    webPreferences: {
      preload,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});

const cleanup = async () => {
  const captainProcess = global.captainProcess as ChildProcess;
  log.info(
    "Cleanup function invoked, is captain running? ",
    !(captainProcess?.killed ?? true),
  );
  if (captainProcess && captainProcess.exitCode === null) {
    const success = killCaptain();
    if (success) {
      global.captainProcess = null;
      log.info("Successfully terminated captain :)");
    } else {
      log.error("Something went wrong when terminating captain!");
    }
  }
};
