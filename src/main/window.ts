import {
  app,
  BrowserWindow,
  shell,
  nativeImage,
  dialog,
  nativeTheme,
} from "electron";
import { update } from "./update";
import log from "electron-log/main";
import { cleanup, isPortFree, killProcess } from "./utils";

import { is } from "@electron-toolkit/utils";

import { join } from "node:path";
import { DIST_ELECTRON, PUBLIC_DIR } from "./consts";

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

// Here, you can also use other preload
const preload = join(__dirname, `../preload/index.js`);

const devServerUrl = process.env["ELECTRON_RENDERER_URL"];
const indexHtml = join(DIST_ELECTRON, "renderer", "index.html");

export async function createWindow() {
  const mainWindow = new BrowserWindow({
    title: "Flojoy Studio",
    icon: getIcon(),
    autoHideMenuBar: true,
    titleBarStyle: process.platform === "darwin" ? "hidden" : "default",
    trafficLightPosition: {
      x: 15,
      y: 17, // macOS traffic lights seem to be 14px in diameter. If you want them vertically centered, set this to `titlebar_height / 2 - 7`.
    },
    webPreferences: {
      preload,
      sandbox: false,
    },
    minHeight: 680,
    minWidth: 1020,
    show: false,
  });
  global.mainWindow = mainWindow;
  global.hasUnsavedChanges = true;
  global.setupStarted = performance.now();

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
      await killProcess(5392).catch((err) => log.error(err));
    }
  }
  if (!app.isPackaged && devServerUrl) {
    await mainWindow.loadURL(devServerUrl);
  } else {
    await mainWindow.loadFile(indexHtml);
  }

  mainWindow.on("close", (e) => {
    if (!global.hasUnsavedChanges) {
      return;
    }
    const choice = dialog.showMessageBoxSync(global.mainWindow, {
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

const editorWindowMap: Map<string, BrowserWindow> = new Map();

export async function createEditorWindow(filepath: string) {
  let editorWindow = editorWindowMap.get(filepath);
  if (editorWindow) {
    if (editorWindow.isMinimized()) {
      editorWindow.restore();
    }
    editorWindow.focus();
    return;
  }

  // Create the browser window.
  editorWindow = new BrowserWindow({
    width: 900,
    height: 670,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: "hidden",
    backgroundColor: nativeTheme.shouldUseDarkColors ? "#000000" : "#ffffff",
    trafficLightPosition: {
      x: 15,
      y: 15, // macOS traffic lights seem to be 14px in diameter. If you want them vertically centered, set this to `titlebar_height / 2 - 7`.
    },
    icon: getIcon(),
    webPreferences: {
      preload: join(__dirname, "../preload/index.js"),
      sandbox: false,
    },
  });

  editorWindow.on("ready-to-show", () => {
    if (editorWindow) {
      editorWindow.show();
    }
  });

  editorWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url);
    return { action: "deny" };
  });

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env["ELECTRON_RENDERER_URL"]) {
    editorWindow.loadURL(
      process.env["ELECTRON_RENDERER_URL"] + "#/editor/" + btoa(filepath),
    );
  } else {
    editorWindow.loadFile(indexHtml, {
      hash: "editor/" + btoa(filepath),
    });
  }

  app.on("before-quit", () => {
    if (editorWindow) {
      editorWindow.removeAllListeners("close");
    }
  });

  editorWindow.on("closed", () => {
    editorWindowMap.delete(filepath);
  });
}
