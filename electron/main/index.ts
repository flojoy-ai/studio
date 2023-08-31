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
import { ChildProcess } from "node:child_process";
import { saveNodePack } from "./node-pack-save";
import { killSubProcess } from "./cmd";

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
const DIS_ELECTRON = join(WORKING_DIR, "dist-electron");
const PUBLIC_DIR = join(WORKING_DIR, "public");

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
});
const runningProcesses: ChildProcess[] = [];
let win: BrowserWindow | null = null;
// Here, you can also use other preload
const preload = join(
  __dirname,
  `../preload/index${!app.isPackaged && "-dev"}.js`,
);
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = join(DIS_ELECTRON, "studio", "index.html");
app.setName("Flojoy Studio");

async function createWindow() {
  win = new BrowserWindow({
    title: "Flojoy Studio",
    icon: getIcon(),
    autoHideMenuBar: app.isPackaged,
    webPreferences: {
      preload,
      // Warning: Enable nodeIntegration and disable contextIsolation is not secure in production
      // Consider using contextBridge.exposeInMainWorld
      // Read more on https://www.electronjs.org/docs/latest/tutorial/context-isolation
      nodeIntegration: true,
      contextIsolation: true,
    },
    show: false,
  });

  global.hasUnsavedChanges = true;

  win.on("close", (e) => {
    if (!global.hasUnsavedChanges) {
      return;
    }
    if (global.initializingBackend) {
      const choice = dialog.showMessageBoxSync(win!, {
        type: "warning",
        buttons: ["Yes", "No, go back"],
        title: "Quit?",
        message:
          "Backend initialization is underway. Are you sure you want to quit?",
      });
      if (choice > 0) {
        e.preventDefault();
      } else {
        global.initializingBackend = false;
      }
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
  // dialog
  //   .showOpenDialog(win, {
  //     title: "Select Download Directory",
  //     properties: ["openDirectory"],
  //   })
  //   .then((result) => {
  //     if (!result.canceled && result.filePaths.length > 0) {
  //       const downloadPath = result.filePaths[0];
  //       console.log(" result paths: ", result.filePaths);
  //       console.log(" selected path: ", downloadPath);

  //       // Here, you can start downloading your resources
  //       // const file = fs.createWriteStream(path.join(downloadPath, 'resource.ext'));

  //       // https.get('https://example.com/resource.ext', (response) => {
  //       //   response.pipe(file);
  //       //   file.on('finish', () => {
  //       //     file.close(() => {
  //       //       console.log('Download finished');
  //       //     });
  //       //   });
  //       // }).on('error', (error) => {
  //       //   fs.unlink(file);
  //       //   console.log('Download failed:', error);
  //       // });
  //     }
  //   })
  //   .catch((err) => {
  //     console.log(" error in open dialog: ", err);
  //   });

  if (app.isPackaged) {
    win.loadFile(indexHtml);
    global.initializingBackend = true;
    runBackend(WORKING_DIR, win)
      .then(({ success, script }) => {
        if (success) {
          global.initializingBackend = false;
          if (script) {
            runningProcesses.push(script);
          }
        }
      })
      .catch(() => {
        global.initializingBackend = false;
      });
  } else {
    // electron-vite-vue#298
    // win.loadURL(url ?? "");
    win.loadFile(join(WORKING_DIR, "electron/html/studio/index.html"));
    // Open devTool if the app is not packaged
    // win.webContents.openDevTools();
  }
  // Test actively push message to the Electron-Renderer
  win.webContents.on("did-finish-load", () => {
    if (win) {
      saveNodePack(win, getIcon());
    }
    win?.webContents.send("main-process-message", new Date().toLocaleString());
  });

  // Make all links open with the browser, not with the application
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("https:")) shell.openExternal(url);
    return { action: "deny" };
  });

  // Apply electron-updater
  update(win);
}

app.whenReady().then(async () => {
  ipcMain.on("set-unsaved-changes", handleSetUnsavedChanges);
  ipcMain.handle("show-save-as-dialog", handleShowSaveAsDialog);
  // await beforeWindow()
  createWindow();
});

app.on("window-all-closed", async () => {
  if (runningProcesses.length) {
    for (const script of runningProcesses) {
      await killSubProcess(script);
    }
  }
  win = null;
  if (process.platform !== "darwin") app.quit();
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
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  if (process.env.VITE_DEV_SERVER_URL) {
    childWindow.loadURL(`${url}#${arg}`);
  } else {
    childWindow.loadFile(indexHtml, { hash: arg });
  }
});
