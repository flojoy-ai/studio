/* eslint-disable @typescript-eslint/no-var-requires */
const { app, BrowserWindow, dialog, Menu } = require("electron");
const isProd = app.isPackaged;
const path = require("upath");
const child_process = require("child_process");

const getReleativePath = (pathStr) =>
  path.toUnix(path.join(__dirname, pathStr));
const APP_ICON =
  process.platform === "darwin"
    ? getReleativePath("../electron/assets/favicon.icns")
    : getReleativePath("../electron/assets/favicon.ico");

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
    dialog.showMessageBoxSync(mainWindow, {
      message: "Something Went Wrong!",
      detail:
        "Something went wrong while trying to pull docker images and \n create docker containers. \n Please Re-run the app.",
      title: " Image build Failed",
      type: "warning",
      icon: APP_ICON,
    });
  });
};

const composeFile = isProd
  ? "./resources/docker-compose-prod.yml"
  : "./docker-compose.yml";
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

  const startURL = getReleativePath("./html-placeholder/index.html");

  mainWindow.loadURL(startURL);

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });
  let shouldLoad = true;
  executeCommand(
    `docker compose -f ${composeFile} up`,
    mainWindow,
    (response) => {
      const possibleResponseStr = [
        "***Listeningonflojoy",
        "***Listeningonflojoy-watch",
        "WatchingforfilechangeswithStatReloader",
      ];
      const textFoundInResponse = possibleResponseStr.find((str) =>
        response.split(" ").join("").includes(str)
      );
      if (textFoundInResponse) {
        if (shouldLoad) {
          mainWindow.loadURL(
            `file://${getReleativePath("../build/index.html")}`
          );
          shouldLoad = false;
        }
      }
    }
  );

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
      child_process.exec(`docker compose -f ${composeFile} down`);
      mainWindow.destroy();
      if (process.platform !== "darwin") {
        app.quit();
      }
      process.exit();
    }
  });

  mainWindow.on("closed", () => {
    mainWindow.destroy();
    child_process.exec(`docker compose -f ${composeFile} down`);
    if (process.platform !== "darwin") {
      app.quit();
    }
    process.exit();
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
