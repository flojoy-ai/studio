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
  checkIfStrIncludes,
} = require("./utils");

let isClosing = false;
const isProd = app.isPackaged;
const envPath = process.env.PATH;
let runningProcesses = [];
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

  let shouldLoad = true;
  let lastResponse = "";

  try {
    sendMsgToIpcRenderer(
      "msg",
      "starting worker-manager server...",
      mainWindow
    );
    const workerPID = await runWorkerManager(isProd, mainWindow);
    if (!runningProcesses.includes(workerPID)) {
      runningProcesses.push(workerPID);
    }
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
    if (!runningProcesses.includes(pid)) {
      runningProcesses.push(pid);
    }
    const djangoReadyStatus = ["System check identified no issues"];
    const containersRunning = ["Container", "Running"];
    const textFoundInResponse =
      checkIfStrIncludes(response, djangoReadyStatus) ||
      checkIfStrIncludes(response, containersRunning);
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
          title: " Failed To Run Docker Containers",
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
      .then(() => {
        sendMsgToIpcRenderer("app_status", "Closing Flojoy...", mainWindow);
        isClosing = true;
        Promise.all(
          runningProcesses.map(async (pidNum) => {
            await killProcess(pidNum);
            runningProcesses = runningProcesses.filter((i) => i !== pidNum);
          })
        )
          .then(() => {
            executeCommand(
              `docker compose -f ${composeFile} down`,
              mainWindow,
              (data) => {
                if (data === "EXITED_COMMAND") {
                  if (process.platform !== "darwin") {
                    app.quit();
                  }
                  mainWindow.destroy();
                  process.exit();
                }
              }
            );
          })
          .catch((err) => {
            sendMsgToIpcRenderer('msg', JSON.stringify(err), mainWindow)
            sendMsgToIpcRenderer('msg', "Closing anyway...", mainWindow)
            console.log("err in task kill: ", err);
            if (process.platform !== "darwin") {
              app.quit();
            }
            mainWindow.destroy();
            process.exit();
          });
      })
      .catch((err) => console.log("error loading placeholder html: ", err));
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
