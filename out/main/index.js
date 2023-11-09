"use strict";
const electron = require("electron");
const contextMenu = require("electron-context-menu");
const node_os = require("node:os");
const node_path = require("node:path");
const electronUpdater = require("electron-updater");
const fs = require("fs");
const path = require("path");
const require$$0 = require("child_process");
const os = require("os");
const http = require("http");
const log = require("electron-log/main");
const utils = require("@electron-toolkit/utils");
function _interopNamespaceDefault(e) {
  const n = Object.create(null, { [Symbol.toStringTag]: { value: "Module" } });
  if (e) {
    for (const k in e) {
      if (k !== "default") {
        const d = Object.getOwnPropertyDescriptor(e, k);
        Object.defineProperty(n, k, d.get ? d : {
          enumerable: true,
          get: () => e[k]
        });
      }
    }
  }
  n.default = e;
  return Object.freeze(n);
}
const fs__namespace = /* @__PURE__ */ _interopNamespaceDefault(fs);
const require$$0__namespace = /* @__PURE__ */ _interopNamespaceDefault(require$$0);
const os__namespace = /* @__PURE__ */ _interopNamespaceDefault(os);
const http__namespace = /* @__PURE__ */ _interopNamespaceDefault(http);
class Logger {
  serviceName;
  logStream;
  constructor(serviceName = "main") {
    if (serviceName) {
      this.serviceName = serviceName;
    }
    const { logsFolderPath, logFileName } = Logger.getLogFilePath(
      this.serviceName
    );
    if (!fs__namespace.existsSync(logsFolderPath)) {
      fs__namespace.mkdirSync(logsFolderPath, { recursive: true });
    }
    this.logStream = fs__namespace.createWriteStream(path.join(logsFolderPath, logFileName), {
      flags: "a"
    });
  }
  log(...messages) {
    messages.join("").split("\n").forEach((line) => {
      const logLine = `[${(/* @__PURE__ */ new Date()).toISOString()}] - ${this.serviceName} - ${line}
`;
      try {
        this.logStream.write(logLine);
        process.stdout.write(logLine);
      } catch (e) {
        throw new Error(`Error in logToFile. Error looks like: ${e}`);
      }
    });
  }
  static getLogFilePath(serviceName) {
    const logsFolderPath = path.join(electron.app.getPath("home"), ".flojoy", "logs");
    const logFileName = `log_${serviceName}.txt`;
    return {
      logsFolderPath,
      logFileName,
      logFilePath: path.join(logsFolderPath, logFileName)
    };
  }
}
const CHECK_FOR_UPDATE_INTERVAL = 6e5;
function update(cleanupFunc) {
  const logger = new Logger("Electron-updater");
  global.updateInterval = null;
  electronUpdater.autoUpdater.autoDownload = false;
  electronUpdater.autoUpdater.allowDowngrade = false;
  electronUpdater.autoUpdater.logger = {
    error: (msg) => logger.log(msg),
    info: (msg) => logger.log(msg),
    warn: (msg) => logger.log(msg),
    debug: (msg) => logger.log(msg)
  };
  if (global.updateInterval) {
    clearInterval(global.updateInterval);
  }
  const checkInterval = setInterval(() => {
    electronUpdater.autoUpdater.checkForUpdates().catch((err) => {
      logger.log("Update check error: ", err);
    });
  }, CHECK_FOR_UPDATE_INTERVAL);
  global.updateInterval = checkInterval;
  electronUpdater.autoUpdater.on(
    "checking-for-update",
    () => logger.log("checking for update....")
  );
  electronUpdater.autoUpdater.on("update-available", (arg) => {
    electron.dialog.showMessageBox({
      type: "info",
      title: "Found Updates",
      message: "Found updates, do you want update now?",
      detail: `An update to v${arg.version} is available! Current version is ${electron.app.getVersion()}`,
      buttons: ["Sure", "No"]
    }).then((buttonIndex) => {
      if (buttonIndex.response === 0) {
        electronUpdater.autoUpdater.downloadUpdate();
        electron.dialog.showMessageBox({
          type: "info",
          title: "Downloading update!",
          message: "Downloading the update.. you'll be notified once update is ready to install.."
        });
      }
    });
    if (global.updateInterval) {
      clearInterval(global.updateInterval);
    }
  });
  electronUpdater.autoUpdater.on("update-downloaded", () => {
    const dialogOpts = {
      type: "info",
      buttons: ["Restart", "Later"],
      title: "Install Updates",
      message: "A new version has been downloaded. Restart the application to apply the updates."
    };
    electron.dialog.showMessageBox(dialogOpts).then(async (returnValue) => {
      if (returnValue.response === 0) {
        await cleanupFunc();
        electronUpdater.autoUpdater.quitAndInstall();
      }
    });
    if (global.updateInterval) {
      clearInterval(global.updateInterval);
    }
  });
  electronUpdater.autoUpdater.on("download-progress", () => {
  });
  electronUpdater.autoUpdater.on("error", (error) => {
    logger.log("Update error: ", error.stack?.toString() ?? "");
    const response = electron.dialog.showMessageBoxSync({
      title: "Update error!",
      type: "error",
      message: "An error occured while downloading the update.",
      buttons: ["Try Again", "OK"]
    });
    if (response === 1) {
      if (global.updateInterval) {
        clearInterval(global.updateInterval);
      }
    }
  });
}
function getDefaultExportFromCjs(x) {
  return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, "default") ? x["default"] : x;
}
var childProcess = require$$0;
var spawn = childProcess.spawn;
var exec = childProcess.exec;
var treeKill = function(pid, signal, callback) {
  if (typeof signal === "function" && callback === void 0) {
    callback = signal;
    signal = void 0;
  }
  pid = parseInt(pid);
  if (Number.isNaN(pid)) {
    if (callback) {
      return callback(new Error("pid must be a number"));
    } else {
      throw new Error("pid must be a number");
    }
  }
  var tree = {};
  var pidsToProcess = {};
  tree[pid] = [];
  pidsToProcess[pid] = 1;
  switch (process.platform) {
    case "win32":
      exec("taskkill /pid " + pid + " /T /F", callback);
      break;
    case "darwin":
      buildProcessTree(pid, tree, pidsToProcess, function(parentPid) {
        return spawn("pgrep", ["-P", parentPid]);
      }, function() {
        killAll(tree, signal, callback);
      });
      break;
    default:
      buildProcessTree(pid, tree, pidsToProcess, function(parentPid) {
        return spawn("ps", ["-o", "pid", "--no-headers", "--ppid", parentPid]);
      }, function() {
        killAll(tree, signal, callback);
      });
      break;
  }
};
function killAll(tree, signal, callback) {
  var killed = {};
  try {
    Object.keys(tree).forEach(function(pid) {
      tree[pid].forEach(function(pidpid) {
        if (!killed[pidpid]) {
          killPid(pidpid, signal);
          killed[pidpid] = 1;
        }
      });
      if (!killed[pid]) {
        killPid(pid, signal);
        killed[pid] = 1;
      }
    });
  } catch (err) {
    if (callback) {
      return callback(err);
    } else {
      throw err;
    }
  }
  if (callback) {
    return callback();
  }
}
function killPid(pid, signal) {
  try {
    process.kill(parseInt(pid, 10), signal);
  } catch (err) {
    if (err.code !== "ESRCH")
      throw err;
  }
}
function buildProcessTree(parentPid, tree, pidsToProcess, spawnChildProcessesList, cb) {
  var ps = spawnChildProcessesList(parentPid);
  var allData = "";
  ps.stdout.on("data", function(data) {
    var data = data.toString("ascii");
    allData += data;
  });
  var onClose = function(code) {
    delete pidsToProcess[parentPid];
    if (code != 0) {
      if (Object.keys(pidsToProcess).length == 0) {
        cb();
      }
      return;
    }
    allData.match(/\d+/g).forEach(function(pid) {
      pid = parseInt(pid, 10);
      tree[parentPid].push(pid);
      tree[pid] = [];
      pidsToProcess[pid] = 1;
      buildProcessTree(pid, tree, pidsToProcess, spawnChildProcessesList, cb);
    });
  };
  ps.on("close", onClose);
}
const treeKill$1 = /* @__PURE__ */ getDefaultExportFromCjs(treeKill);
const runCmd = ({
  command,
  broadcast,
  serviceName,
  matchText
}) => {
  return new Promise((resolve, reject) => {
    const logger = new Logger(serviceName);
    const script = require$$0__namespace.exec(command);
    if (global.runningProcesses && Array.isArray(global.runningProcesses)) {
      global.runningProcesses.push(script);
    }
    let lastOutput;
    script.stdout?.on("data", function(data) {
      const dataStr = `[${serviceName}] - ${data?.toString()}`;
      logger.log(dataStr);
      lastOutput = dataStr;
      if (broadcast) {
        broadcast.cb(broadcast.win, dataStr);
      }
      if (matchText && dataStr.includes(matchText)) {
        resolve({ script });
      }
    });
    script.stderr?.on("data", function(data) {
      const dataStr = `[${serviceName}] - ${data?.toString()}`;
      logger.log(dataStr);
      lastOutput = dataStr;
      if (broadcast) {
        broadcast.cb(broadcast.win, dataStr);
      }
      if (matchText && dataStr.includes(matchText)) {
        resolve({ script });
      }
    });
    script.addListener("exit", (code) => {
      logger.log(
        `exited child process [${serviceName}] with code: `,
        code?.toString() ?? ""
      );
      if (global.runningProcesses?.length && global.runningProcesses.find(
        (s) => s.pid === script.pid
      )) {
        global.runningProcesses = global.runningProcesses.filter(
          (s) => s.pid !== script.pid
        );
      }
      reject({ code, lastOutput });
    });
  });
};
const killSubProcess = (script) => {
  return new Promise((resolve, reject) => {
    if (!script.killed) {
      treeKill$1(script.pid ?? 0, (err) => {
        if (err) {
          console.log(
            "error in killing pid: ",
            script.pid,
            " ",
            err.message.toString()
          );
          reject(err.message.toString());
        } else {
          console.log("killed pid: ", script.pid, " successfully!");
          resolve(true);
        }
      });
    } else {
      resolve(true);
    }
  });
};
const sendBackendLogToStudio = (title, description) => (win, data) => {
  if (global.initializingBackend) {
    win.webContents.send(
      "electron-log",
      typeof data === "string" ? {
        open: true,
        title,
        description,
        output: data
      } : { ...data, title, description }
    );
  }
};
const successText = "Uvicorn running on";
const runBackend = (workingDir, win) => {
  const backendCommand = getBackendCommand(workingDir);
  return new Promise((resolve2) => {
    global.initializingBackend = true;
    const title = "Initializing backend...";
    const description = "Initialization can take up to few minutes for first time, please be patient!";
    sendBackendLogToStudio(title, description)(win, {
      open: true,
      clear: true,
      output: "Running backend script..."
    });
    runCmd({
      command: backendCommand,
      matchText: successText,
      broadcast: {
        win,
        cb: sendBackendLogToStudio(title, description)
      },
      serviceName: "backend"
    }).then(({ script }) => {
      sendBackendLogToStudio(title, description)(win, {
        open: false,
        output: ":info: backend initialized successfully!"
      });
      global.initializingBackend = false;
      resolve2({ success: true, script });
    }).catch((err) => {
      if (err.code > 0) {
        sendBackendLogToStudio(title, description)(win, {
          open: true,
          output: `${err.lastOutput} 

 Error: Failed to initialize backend, please try relaunching the app!`
        });
        electron.dialog.showErrorBox(
          "Failed to initialize backend!",
          "Something went wrong while initializing backend!\n Restarting the app might resolve the issue"
        );
        global.initializingBackend = false;
        resolve2({ success: false, script: void 0 });
      }
    });
  });
};
const getBackendCommand = (workingDir) => {
  if (process.platform === "win32") {
    return `pwsh -File ${path.join(workingDir, "../backend/backend.ps1")}`;
  }
  if (process.platform === "darwin") {
    return `zsh "${path.resolve(path.join(workingDir, "../backend/backend.sh"))}"`;
  }
  return `bash "${path.resolve(path.join(workingDir, "../backend/backend.sh"))}"`;
};
const getBlocksPathFile = () => {
  const fileName = "blocks_path.txt";
  return path.join(os__namespace.homedir(), ".flojoy", fileName);
};
const saveBlocksPack = async ({
  win,
  icon,
  startup,
  update: update2
}) => {
  return new Promise((resolve) => {
    if (startup && fs__namespace.existsSync(getBlocksPathFile()) && fs__namespace.existsSync(getBlocksDirPath())) {
      resolve({ success: true });
      return;
    }
    if (update2) {
      updateBlocksPack(getBlocksDirPath(), win, icon);
      resolve({ success: true });
      return;
    }
    const defaultSavePath = getBlocksDirPath();
    const savePath = getSavePath(win, icon, defaultSavePath ?? "", !startup);
    if (!startup && defaultSavePath === savePath) {
      resolve({ success: true });
      return;
    }
    cloneBlocksRepo(savePath, win).then(() => resolve({ success: true })).catch((err) => resolve(err));
  });
};
const getSavePath = (win, icon, savePath, update2) => {
  const message = update2 ? "Choose location for downloading blocks resource pack" : "Studio requires blocks resource pack to function correctly!";
  const res = electron.dialog.showMessageBoxSync(win, {
    type: "info",
    title: "Download blocks resource pack",
    message,
    detail: `Blocks resource pack will be downloaded to following location: 

 ${savePath?.replace(
      /\\/g,
      "/"
    )}`,
    buttons: ["Change", "Continue"],
    icon,
    defaultId: 1,
    cancelId: 1
  });
  if (res == 0) {
    const selectedPaths = electron.dialog.showOpenDialogSync(win, {
      buttonLabel: "Change",
      properties: ["openDirectory"]
    });
    if (selectedPaths?.length) {
      const path$1 = selectedPaths[0];
      return getSavePath(win, icon, path.join(path$1, "blocks"), update2);
    }
    return getSavePath(win, icon, savePath, update2);
  } else {
    return savePath;
  }
};
const savePathToLocalFile = (fileName, path2) => {
  fs__namespace.writeFileSync(fileName, path2);
};
const cloneBlocksRepo = (clonePath, win) => {
  return new Promise((resolve, reject) => {
    if (fs__namespace.existsSync(clonePath)) {
      electron.dialog.showMessageBox(win, {
        message: "Blocks resource pack added successfully!",
        detail: `Blocks resources will be added from ${clonePath}`
      });
      savePathToLocalFile(getBlocksPathFile(), clonePath);
      win.reload();
      resolve({ success: true });
      return;
    }
    const cloneCmd = `git clone https://github.com/flojoy-ai/blocks.git ${clonePath}`;
    const title = "Downloading blocks resource pack!";
    const description = `Downloading blocks resource pack to ${clonePath}...`;
    sendLogToStudio(title, description)(win, {
      open: true,
      output: description,
      clear: true
    });
    runCmd({
      command: cloneCmd,
      broadcast: { win, cb: sendLogToStudio(title, description) },
      serviceName: "Blocks-resource"
    }).catch(({ code, lastOutput }) => {
      if (code > 0) {
        sendLogToStudio(title, description)(win, {
          open: true,
          output: "Error :: Failed to download blocks resource pack, see error printed above!"
        });
        electron.dialog.showErrorBox(
          "Failed to download blocks resource pack!",
          lastOutput
        );
        reject(new Error(lastOutput));
      } else {
        sendLogToStudio(title, description)(win, { open: false, output: "" });
        electron.dialog.showMessageBox(win, {
          message: "Blocks resource pack downloaded successfully!",
          type: "info"
        });
        savePathToLocalFile(getBlocksPathFile(), clonePath);
        win.reload();
        resolve({ success: true });
      }
    });
  });
};
const getBlocksDirPath = () => {
  if (fs__namespace.existsSync(getBlocksPathFile())) {
    return fs__namespace.readFileSync(getBlocksPathFile(), { encoding: "utf-8" });
  }
  if (!electron.app.isPackaged) {
    return path.join(process.cwd(), "PYTHON", "blocks");
  }
  return path.join(electron.app.getPath("downloads"), "blocks");
};
const sendLogToStudio = (title, description) => (win, data) => {
  win.webContents.send(
    "electron-log",
    typeof data === "string" ? {
      open: true,
      title,
      description,
      output: data
    } : { ...data, title, description }
  );
};
const updateBlocksPack = (blocksPath, win, icon) => {
  const title = "Updating blocks resource pack";
  const description = "Update can take few minutes to complete, please do not close the app!";
  sendLogToStudio(title, description)(win, {
    open: true,
    clear: true,
    output: description
  });
  const currentDirectory = process.cwd();
  if (!fs__namespace.existsSync(blocksPath)) {
    sendLogToStudio(title, description)(
      win,
      `Error - Blocks directory is not found at ${blocksPath}.. downloading blocks resource pack..`
    );
    saveBlocksPack({
      win,
      startup: true,
      icon
    });
    return;
  }
  try {
    process.chdir(blocksPath);
    const statusOutput = require$$0.execSync("git status --porcelain").toString();
    if (statusOutput.trim().length > 0) {
      sendLogToStudio(title, description)(
        win,
        "Found local changes, creating a zip archive..."
      );
      const timestamp = (/* @__PURE__ */ new Date()).toISOString().replace(/[-:.]/g, "");
      const zipFileName = `local_changes_${timestamp}.zip`;
      require$$0.execSync(`git archive -o ${zipFileName} HEAD`);
      sendLogToStudio(title, description)(
        win,
        `Created zip file: ${zipFileName} ...`
      );
      const zipFolder = path.join(blocksPath, ".local-changes");
      fs__namespace.mkdirSync(zipFolder, { recursive: true });
      sendLogToStudio(title, description)(
        win,
        `Copying ${zipFileName} file to ${zipFolder}...`
      );
      const zipFilePath = path.join(zipFolder, zipFileName);
      fs__namespace.renameSync(zipFileName, zipFilePath);
      require$$0.execSync("git stash");
      require$$0.execSync("git pull");
      sendLogToStudio(title, description)(
        win,
        "Updated blocks resource pack successfully!"
      );
    } else {
      sendLogToStudio(title, description)(
        win,
        "Updating blocks resource pack... hang tight.."
      );
      const pullResult = require$$0.execSync("git pull").toString();
      sendLogToStudio(title, description)(win, pullResult);
      sendLogToStudio(title, description)(
        win,
        "Updated blocks resource pack successfully!"
      );
    }
    win.reload();
    process.chdir(currentDirectory);
  } catch (error) {
    electron.dialog.showErrorBox("Failed to update blocks pack", error?.message);
    process.chdir(currentDirectory);
  }
};
log.initialize({ preload: true });
log.info("Welcome to Flojoy Studio!");
const WORKING_DIR = node_path.join(__dirname, "../../");
const DIST_ELECTRON = node_path.join(WORKING_DIR, "dist-electron");
const PUBLIC_DIR = node_path.join(WORKING_DIR, electron.app.isPackaged ? "../public" : "public");
if (node_os.release().startsWith("6.1"))
  electron.app.disableHardwareAcceleration();
if (process.platform === "win32")
  electron.app.setAppUserModelId(electron.app.getName());
if (!electron.app.requestSingleInstanceLock()) {
  electron.app.quit();
  process.exit(0);
}
const getIcon = () => {
  switch (process.platform) {
    case "win32":
      return node_path.join(PUBLIC_DIR, "favicon.ico");
    case "linux":
      return node_path.join(PUBLIC_DIR, "favicon.png");
    default:
      return node_path.join(PUBLIC_DIR, "favicon.png");
  }
};
const handleSetUnsavedChanges = (_, value) => {
  global.hasUnsavedChanges = value;
};
const handleWriteFileSync = (_, path2, data) => {
  fs.writeFileSync(path2, data);
};
const handleShowSaveAsDialog = async (_, defaultFilename) => {
  return await electron.dialog.showSaveDialog({
    defaultPath: defaultFilename,
    filters: [
      {
        name: "json",
        extensions: ["json"]
      }
    ]
  });
};
contextMenu({
  showSaveImageAs: true,
  prepend() {
    return [
      {
        label: "Reload Studio",
        visible: true,
        click(_, browserWindow) {
          browserWindow?.webContents.reload();
        }
      }
    ];
  }
});
const isPortFree = (port) => new Promise((resolve) => {
  const server = http__namespace.createServer().listen(port, "127.0.0.1", () => {
    server.close();
    resolve(true);
  }).on("error", () => {
    resolve(false);
  });
});
global.runningProcesses = [];
const preload = node_path.join(__dirname, `../preload/index.js`);
const url = process.env.VITE_DEV_SERVER_URL;
const indexHtml = node_path.join(DIST_ELECTRON, "studio", "index.html");
electron.app.setName("Flojoy Studio");
async function createWindow() {
  const mainWindow = new electron.BrowserWindow({
    title: "Flojoy Studio",
    icon: getIcon(),
    autoHideMenuBar: electron.app.isPackaged,
    webPreferences: {
      preload,
      sandbox: false
    },
    show: false
  });
  global.mainWindow = mainWindow;
  global.hasUnsavedChanges = true;
  mainWindow.on("ready-to-show", () => {
    mainWindow.show();
    mainWindow.maximize();
  });
  if (process.platform === "darwin") {
    electron.app.dock.setIcon(electron.nativeImage.createFromPath(getIcon()));
  }
  if (utils.is.dev && process.env["ELECTRON_RENDERER_URL"]) {
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
    const choice = electron.dialog.showMessageBoxSync(mainWindow, {
      type: "question",
      buttons: ["Yes", "No, go back"],
      title: "Quit?",
      message: "You have unsaved changes. Are you sure you want to quit Flojoy Studio?"
    });
    if (choice > 0)
      e.preventDefault();
  });
  if (electron.app.isPackaged) {
    if (await isPortFree(5392)) {
      runBackend(WORKING_DIR, mainWindow).then(({ success }) => {
        if (success) {
          mainWindow?.reload();
        }
      });
    } else {
      const choice = electron.dialog.showMessageBoxSync(mainWindow, {
        type: "question",
        buttons: ["Exit", "Refresh"],
        title: "Existing Server Detected",
        message: "Seems like there is already a Flojoy server running! You should terminate that before running this client."
      });
      if (choice > 0) {
        electron.app.relaunch();
        electron.app.exit();
      } else {
        electron.app.quit();
      }
    }
  }
  mainWindow.webContents.setWindowOpenHandler(({ url: url2 }) => {
    if (url2.startsWith("https:"))
      electron.shell.openExternal(url2);
    return { action: "deny" };
  });
  electron.ipcMain.on("update-blocks-pack", () => {
    if (global.mainWindow)
      saveBlocksPack({ win: global.mainWindow, icon: getIcon(), update: true });
  });
  electron.ipcMain.on("change-blocks-resource-path", async () => {
    if (global.mainWindow) {
      await saveBlocksPack({ win: global.mainWindow, icon: getIcon() });
    }
  });
  update(cleanup);
}
electron.app.whenReady().then(async () => {
  electron.ipcMain.on("set-unsaved-changes", handleSetUnsavedChanges);
  electron.ipcMain.on("write-file-sync", handleWriteFileSync);
  electron.ipcMain.handle("show-save-as-dialog", handleShowSaveAsDialog);
  createWindow();
});
electron.app.on("window-all-closed", async () => {
  log.info("window-all-closed fired!");
  await cleanup();
  if (process.platform !== "darwin") {
    electron.app.exit(0);
  }
});
electron.app.on("before-quit", async (e) => {
  e.preventDefault();
  log.info("before-quit fired!");
  await cleanup();
  electron.app.exit(0);
});
electron.app.on("second-instance", () => {
  if (global.mainWindow) {
    if (global.mainWindow.isMinimized())
      global.mainWindow.restore();
    global.mainWindow.focus();
  }
});
electron.app.on("activate", () => {
  const allWindows = electron.BrowserWindow.getAllWindows();
  if (allWindows.length) {
    allWindows[0].focus();
  } else {
    createWindow();
  }
});
electron.ipcMain.handle("open-win", (_, arg) => {
  const childWindow = new electron.BrowserWindow({
    webPreferences: {
      preload
    }
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
    global.runningProcesses.length
  );
  if (global.runningProcesses.length) {
    for (const script of global.runningProcesses) {
      try {
        log.info("Killing script: ", script.pid);
        await killSubProcess(script);
        global.runningProcesses = global.runningProcesses.filter(
          (s) => s.pid !== script.pid
        );
        log.info("kill success!");
      } catch (error) {
        log.info("error while killing sub process: ", JSON.stringify(error));
      }
    }
  }
};
