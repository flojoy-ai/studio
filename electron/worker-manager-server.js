/* eslint-disable @typescript-eslint/no-var-requires */
const child_process = require("child_process");
const { getReleativePath } = require("./utils");

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
/**
 * 
 * @param {boolean} isProd 
 * @returns 
 */
const runWorkerManager = async (isProd) => {
  return new Promise((resolve, reject) => {
    const folderName = "worker-manager";
    const prodFilePath =
      process.platform === "win32"
        ? `./resources/${folderName}`
        : getReleativePath(`../../${folderName}`);
    const filePath = isProd ? prodFilePath : folderName;
    executeCommand(
      `cd ${filePath} && npm install && npm run start`,
      (data, pid) => {
        console.log("worker-manager:: ", data);
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
