/* eslint-disable @typescript-eslint/no-var-requires */
const { app, BrowserWindow, dialog, Menu } = require("electron");
const isProd = app.isPackaged;
const path = require("upath");
const child_process = require("child_process");
const { getErrorDetail } = require("./error-helper");
const envPath = process.env.PATH;
if (!envPath?.split(":").includes("usr/local/bin")) {
  process.env.PATH = [...envPath.split(":"), "usr/local/bin"].join(":");
}
const getReleativePath = (pathStr) =>
  path.toUnix(path.join(__dirname, pathStr));
const APP_ICON =
  process.platform === "win32"
    ? getReleativePath("../electron/assets/favicon.ico")
    : getReleativePath("../electron/assets/favicon.icns");

const executeCommand = (command, mainWindow, cb) => {
  const script = child_process.exec(command);
  script.stdout.on("data", function (data) {
    mainWindow.webContents.send("msg", data.toString());
    if (cb) cb(data);
  });
  script.stderr.on("data", function (data) {
    mainWindow.webContents.send("err", data);
    if (cb) cb(data);
  });
  script.addListener("exit", () => {
    if (cb) cb("EXITED_COMMAND");
  });
};

const getComposeFilePath = () => {
  if (!isProd) {
    return "docker-compose.yml";
  }
  const fileName = "docker-compose-prod.yml";
  if (process.platform === "win32") {
    return `./resources/${fileName}`;
  }
  return getReleativePath(`../../${fileName}`);
};

const composeFile = getComposeFilePath();

const createMainWindow = () => {
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
      mainWindow.webContents.send("app_status", "Initializing Flojoy...")
    );
  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
  let isClosing = false;
  let shouldLoad = true;
  let lastResponse = "";

  const command = `docker-compose -f ${composeFile} up`;
  executeCommand(command, mainWindow, (response) => {
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

  const composeDownAndClose = () => {
    mainWindow
      .loadURL(loadingPageURL)
      .then(() =>
        mainWindow.webContents.send("app_status", "Closing Flojoy...")
      );
    const composeDownCommand = `docker-compose -f ${composeFile} down`;
    isClosing = true;
    executeCommand(composeDownCommand, mainWindow, (response) => {
      if (response === "EXITED_COMMAND") {
        mainWindow.destroy();
        if (process.platform !== "darwin") {
          app.quit();
        }
        process.exit();
      }
    });
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
      composeDownAndClose();
    }
  });

  mainWindow.on("closed", () => {
    composeDownAndClose();
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
