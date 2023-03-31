/* eslint-disable @typescript-eslint/no-var-requires */
const path = require("upath");
const child_process = require("child_process");
const { BrowserWindow } = require("electron");

/**
 *
 * @param {string} pathStr
 * @returns {string}
 */
const getReleativePath = (pathStr) =>
  path.toUnix(path.join(__dirname, pathStr));

/**
 *
 * @param {boolean} isProd
 * @returns {string}
 */
const getComposeFilePath = (isProd) => {
  if (!isProd) {
    return "docker-compose.yml";
  }
  const fileName = "docker-compose-prod.yml";
  if (process.platform === "win32") {
    return `./resources/${fileName}`;
  }
  return getReleativePath(`../../${fileName}`);
};

/**
 *
 * @param {string} command
 * @param {BrowserWindow} mainWindow
 * @param {(data:string, pid: number)=> void} cb
 */
const execCmdWithBroadcasting = (command, mainWindow, cb) => {
  const script = child_process.exec(command);
  script.stdout.on("data", function (data) {
    mainWindow.webContents.send("msg", data.toString());
    if (cb) cb(data, script.pid);
  });
  script.stderr.on("data", function (data) {
    mainWindow.webContents.send("err", data);
    if (cb) cb(data, script.pid);
  });
  script.addListener("exit", () => {
    if (cb) cb("EXITED_COMMAND", script.pid);
  });
};

/**
 *
 * @param {string} channel
 * @param {string} data
 * @param {BrowserWindow} mainWindow
 * @returns
 */
const sendMsgToIpcRenderer = (channel, data, mainWindow) => {
  return mainWindow.webContents.send(channel, data);
};

/**
 * 
 * @param {string} str 
 * @param {string[]} texts 
 */
const checkIfStrIncludes = (str, texts) => {
  const filterArr=  texts.filter(i=> str.includes(i))
   return filterArr.length === texts.length
 }

module.exports = {
  getReleativePath,
  execCmdWithBroadcasting,
  getComposeFilePath,
  sendMsgToIpcRenderer,
  checkIfStrIncludes
};
