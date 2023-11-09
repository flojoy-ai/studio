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
import { runBackend } from "./backend";
import { saveBlocksPack } from "./blocks-pack-save";
import { killSubProcess } from "./command";
import fs from "fs";
import { ChildProcess } from "node:child_process";
import * as http from "http";
// import fixpath from "fix-path";
import log from "electron-log/main";
import { is } from "@electron-toolkit/utils";

// fixpath();
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
const WORKING_DIR = join(__dirname, "../../");
const DIST_ELECTRON = join(WORKING_DIR, "dist-electron");
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

const isPortFree = (port: number) =>
  new Promise((resolve) => {
    const server = http
      .createServer()
      .listen(port, "127.0.0.1", () => {
        server.close();
        resolve(true);
      })
      .on("error", () => {
        resolve(false);
      });
  });

global.runningProcesses = [];

// Here, you can also use other preload
const preload = join(__dirname, `../preload/index.js`);

const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(DIST_ELECTRON, "studio", "index.html");

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
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    mainWindow.loadURL(process.env["ELECTRON_RENDERER_URL"]);
  } else {
    mainWindow.loadFile(indexHtml).catch((err) => {
      log.error(" loadfile error: ", err);
    });
  }
  await saveBlocksPack({ win: mainWindow, icon: getIcon(), startup: true });

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

  if (app.isPackaged) {
    if (await isPortFree(5392)) {
      runBackend(WORKING_DIR, mainWindow).then(({ success }) => {
        if (success) {
          // reload studio html to fetch fresh manifest file
          mainWindow?.reload();
        }
      });
    } else {
      const choice = dialog.showMessageBoxSync(mainWindow!, {
        type: "question",
        buttons: ["Exit", "Refresh"],
        title: "Existing Server Detected",
        message:
          "Seems like there is already a Flojoy server running! You should terminate that before running this client.",
      });
      if (choice > 0) {
        app.relaunch();
        app.exit();
      } else {
        app.quit();
      }
    }
  }

  // Make all links open with the browser, not with the application
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });

  ipcMain.on("update-blocks-pack", () => {
    if (global.mainWindow)
      saveBlocksPack({ win: global.mainWindow, icon: getIcon(), update: true });
  });
  ipcMain.on("change-blocks-resource-path", async () => {
    if (global.mainWindow) {
      await saveBlocksPack({ win: global.mainWindow, icon: getIcon() });
    }
  });
  // Apply electron-updater
  update(cleanup);
}

app.whenReady().then(async () => {
  ipcMain.on("set-unsaved-changes", handleSetUnsavedChanges);
  ipcMain.on("write-file-sync", handleWriteFileSync);
  ipcMain.handle("show-save-as-dialog", handleShowSaveAsDialog);
  createWindow();
});

app.on("window-all-closed", async () => {
  log.info("window-all-closed fired!");
  await cleanup();
  if (process.platform !== "darwin") {
    app.exit(0);
  }
});

app.on("before-quit", async (e) => {
  e.preventDefault();
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
  log.info(
    "Cleanup function invoked, running processes: ",
    global.runningProcesses.length,
  );
  if (global.runningProcesses.length) {
    for (const script of global.runningProcesses) {
      try {
        log.info("Killing script: ", script.pid);
        await killSubProcess(script);
        global.runningProcesses = global.runningProcesses.filter(
          (s: ChildProcess) => s.pid !== script.pid,
        );
        log.info("kill success!");
      } catch (error) {
        log.info("error while killing sub process: ", JSON.stringify(error));
      }
    }
  }
};
