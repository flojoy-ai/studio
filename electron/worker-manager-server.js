/* eslint-disable @typescript-eslint/no-var-requires */
const child_process = require("child_process");
const { getReleativePath, sendMsgToIpcRenderer } = require("./utils");

const executeCommand = (command, cb) => {
  const script = child_process.exec(command);
  script.stdout.on("data", function (data) {
    if (cb) cb(data, script.pid);
  });
  script.stderr.on("data", function (data) {
    if (cb) cb(data, script.pid);
  });
  script.addListener("exit", () => {
    if (cb) cb("EXITED_COMMAND", script.pid);
  });
};

const runWorkerManager = async (mainWindow) => {
  return new Promise((resolve, reject) => {
    const folderName = "worker-manager";
    const filePath =
      process.platform === "win32"
        ? `./resources/${folderName}`
        : getReleativePath(`../../${folderName}`);
    executeCommand(
      `cd ${filePath} && npm install && npm run start`,
      (data, pid) => {
        console.log("worker-manager:: ", data);
        sendMsgToIpcRenderer("msg", data.toString(), mainWindow);
        if (data.includes("Running worker-manager on port")) {
          resolve(pid);
        }
        if (data === "EXITED_COMMAND") {
          reject("Failed to run worker manager!");
        }
      }
    );
  });
};

module.exports = { runWorkerManager };
