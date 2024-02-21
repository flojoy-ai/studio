import { app, BrowserWindow, ipcMain } from "electron";
import contextMenu from "electron-context-menu";
import { release } from "node:os";
import log from "electron-log/main";
import { API } from "../types/api";
import { logListener } from "./logging";
import { createWindow } from "./window";
import { registerIpcMainHandlers } from "./ipc-main-handlers";
import { cleanup } from "./utils";

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
  registerIpcMainHandlers();
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
