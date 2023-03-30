/* eslint-disable @typescript-eslint/no-var-requires */
const { app, BrowserWindow, dialog, Menu } = require("electron");
const { getErrorDetail } = require("./error-helper");
const { runWorkerManager } = require("./worker-manager-server");
const { killProcess } = require("./kill-task");
const {
  getReleativePath,
  execCmdWithBroadcasting: executeCommand,
  getComposeFilePath,
  sendMsgToIpcRenderer,
} = require("./utils");

const isProd = app.isPackaged;
const envPath = process.env.PATH;
const runningProcesses = [];
const composeFile = getComposeFilePath(isProd);
const APP_ICON =
  process.platform === "win32"
    ? getReleativePath("../electron/assets/favicon.ico")
    : getReleativePath("../electron/assets/favicon.icns");

if (!envPath?.split(":").includes("usr/local/bin")) {
  process.env.PATH = [...envPath.split(":"), "usr/local/bin"].join(":");
}

const createMainWindow = async () => {
  Menu.setApplicationMenu(null);
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    icon: APP_ICON,
    backgroundColor: "white",
    autoHideMenuBar: true,
    webPreferences: {
      preload: getReleativePath("preload.js"),
      devTools: !isProd,
    },
  });
  const loadingPageURL = `file://${getReleativePath(
    "./html-placeholder/index.html"
  )}`;

  mainWindow
    .loadURL(loadingPageURL)
    .then(() =>
      sendMsgToIpcRenderer("app_status", "Initializing Flojoy...", mainWindow)
    );
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  let isClosing = false;
  let shouldLoad = true;
  let lastResponse = "";

  try {
    sendMsgToIpcRenderer(
      "msg",
      "starting worker-manager server...",
      mainWindow
    );
    const workerPID = await runWorkerManager(mainWindow);
    runningProcesses.push(workerPID);
    sendMsgToIpcRenderer("msg", "worker-manager is running...", mainWindow);
  } catch (error) {
    sendMsgToIpcRenderer(
      "msg",
      "worker-manager server failed to start...",
      mainWindow
    );
  }
  const composeCmd = `docker-compose -f ${composeFile} up`;
  executeCommand(composeCmd, mainWindow, (response, pid) => {
    runningProcesses.push(pid);
    const possibleResponseStr = ["WatchingforfilechangeswithStatReloader"];
    const textFoundInResponse = possibleResponseStr.find((str) =>
      response.split(" ").join("").includes(str)
    );
    if (textFoundInResponse) {
      if (shouldLoad) {
        mainWindow.loadURL(`file://${getReleativePath("../build/index.html")}`);
        shouldLoad = false;
      }
    }
    if (response === "EXITED_COMMAND") {
      if (!isClosing) {
        const { message, detail } = getErrorDetail(lastResponse);
        dialog.showMessageBoxSync(mainWindow, {
          title: "  Failed To Run Docker Containers",
          message,
          detail,
          type: "error",
          icon: APP_ICON,
        });
      }
    } else {
      lastResponse = response;
    }
  });

  const closeApp = async () => {
    mainWindow
      .loadURL(loadingPageURL)
      .then(() =>
        sendMsgToIpcRenderer("app_status", "Closing Flojoy...", mainWindow)
      );
    runningProcesses.forEach(async (pid) => {
      console.log("killing pid: ", pid);
      await killProcess(pid);
    });
    mainWindow.destroy();
    if (process.platform !== "darwin") {
      app.quit();
    }
    process.exit();
  };

  mainWindow.on("close", async (e) => {
    e.preventDefault();
    const options = {
      type: "question",
      buttons: ["Yes", "No"],
      defaultId: 0,
      title: "Confirm",
      message: "Are you sure you want to quit?",
    };
    const { response } = await dialog.showMessageBox(mainWindow, options);
    if (response === 0) {
      closeApp();
    }
  });

  mainWindow.on("closed", () => {
    closeApp();
  });

  mainWindow.webContents.setWindowOpenHandler((details) => {
    const { url } = details;
    mainWindow.loadURL(url);
  });
};

app.whenReady().then(() => {
  createMainWindow();
  app.on("activate", () => {
    if (!BrowserWindow.getAllWindows().length) {
      createMainWindow();
    }
  });
});
