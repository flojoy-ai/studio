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
import { saveNodePack } from "./node-pack-save";
import { killSubProcess } from "./cmd";
import fs from "fs";
import { Logger } from "./logger";
import { ChildProcess } from "node:child_process";

// The built directory structure
//
// ├─┬ dist-electron
// │ ├─┬ main
// │ │ └── index.js    > Electron-Main
// │ └─┬ preload
// │   └── index.js    > Preload-Scripts
// ├─┬ studio
// │ └── index.html    > Electron-Renderer
//
const WORKING_DIR = join(__dirname, "../../");
const DIST_ELECTRON = join(WORKING_DIR, "dist-electron");
const PUBLIC_DIR = join(WORKING_DIR, app.isPackaged ? "../public" : "public");

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

export const mainLogger = new Logger();
console.log = (...messages: string[]) => mainLogger.log(...messages);

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
    const server = require("http")
      .createServer()
      .listen(port, () => {
        server.close();
        resolve(true);
      })
      .on("error", () => {
        resolve(false);
      });
  });

global.runningProcesses = [];

let win: BrowserWindow | null = null;

// Here, you can also use other preload
const preload = join(__dirname, `../preload/index.js`);

const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(DIST_ELECTRON, "studio", "index.html");

app.setName("Flojoy Studio");

async function createWindow() {
  win = new BrowserWindow({
    title: "Flojoy Studio",
    icon: getIcon(),
    autoHideMenuBar: app.isPackaged,
    webPreferences: {
      preload,
    },
    show: false,
  });

  global.hasUnsavedChanges = true;

  win.on("close", (e) => {
    if (!global.hasUnsavedChanges) {
      return;
    }
    const choice = dialog.showMessageBoxSync(win!, {
      type: "question",
      buttons: ["Yes", "No, go back"],
      title: "Quit?",
      message:
        "You have unsaved changes. Are you sure you want to quit Flojoy Studio?",
    });
    if (choice > 0) e.preventDefault();
  });

  // setting icon for mac
  if (process.platform === "darwin") {
    app.dock.setIcon(nativeImage.createFromPath(getIcon()));
  }

  win.maximize();
  win.show();

  if (app.isPackaged) {
    await win.loadFile(indexHtml);
  } else {
    // electron-vite-vue#298
    await win.loadURL(url ?? "");
  }
  await saveNodePack({ win, icon: getIcon(), startup: true });
  if (app.isPackaged) {
    if (await isPortFree(3000)) {
      runBackend(WORKING_DIR, win).then(({ success }) => {
        if (success) {
          // reload studio html to fetch fresh manifest file
          win?.reload();
        }
      });
    } else {
      const choice = dialog.showMessageBoxSync(win!, {
        type: "question",
        buttons: ["Exit", "Refresh"],
        title: "Existing Server Detected",
        message:
          "Seems like there is already a Flojoy server running! You should either terminate that one or use that one instead.",
      });
      if (choice > 0) {
        win?.reload();
      } else {
        app.quit();
      }
    }
  }

  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });

  ipcMain.on("update-nodes-pack", () => {
    if (win) saveNodePack({ win, icon: getIcon(), update: true });
  });
  ipcMain.on("update-nodes-resource-path", async () => {
    if (win) {
      await saveNodePack({ win, icon: getIcon() });
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
  mainLogger.log("window-all-closed fired!");
  await cleanup();
  if (process.platform !== "darwin") {
    app.exit(0);
  }
});

app.on("before-quit", async (e) => {
  e.preventDefault();
  mainLogger.log("before-quit fired!");
  await cleanup();
  app.exit(0);
});

app.on("second-instance", () => {
  if (win) {
    // Focus on the main window if the user tried to open another
    if (win.isMinimized()) win.restore();
    win.focus();
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
  mainLogger.log(
    "Cleanup function invoked, running processes: ",
    global.runningProcesses.length,
  );
  if (global.runningProcesses.length) {
    for (const script of global.runningProcesses) {
      try {
        mainLogger.log("Killing script: ", script.pid);
        await killSubProcess(script);
        global.runningProcesses = global.runningProcesses.filter(
          (s: ChildProcess) => s.pid !== script.pid,
        );
        mainLogger.log("kill success!");
      } catch (error) {
        mainLogger.log(
          "error while killing sub process: ",
          JSON.stringify(error),
        );
      }
    }
  }
};
