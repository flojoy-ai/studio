import * as childProcess from "child_process";
import path from "path";
import { runCmd } from "./cmd";
import type { CallBackArgs } from "../api/index";
import { app, dialog } from "electron";
import fs from "fs";

// const path = require('path');
// const fs = require('fs');

// Get the current date and time
export const logToFile = (message) => {
  const logLine = `[${new Date().toISOString()}] ${message}\n`;

  try {
    // Write to the log stream
    logStream.write(logLine);
    // Log to the console
    process.stdout.write(logLine);
  } catch (e) {
    throw new Error(`Error in logToFile. Error looks like: ${e}`);
  }
};
const now = new Date();
const formattedDate = now.toISOString().replace(/:/g, "-").substring(0, 19);

// Append the formatted date and time to the log file name
const logFileName = `log_${formattedDate}.txt`;
const logsFolderPath = path.join(app.getPath("home"), ".flojoy", "logs");
if (!fs.existsSync(logsFolderPath)) {
  fs.mkdirSync(logsFolderPath, { recursive: true });
}
const logStream = fs.createWriteStream(path.join(logsFolderPath, logFileName), {
  flags: "a",
});

// Overwrite the regular console logging to have it happen in a persistent disk location
console.log = (message) =>
  logToFile(`[LOG] - [background.ts] - ${JSON.stringify(message)}`);
console.error = (error) =>
  logToFile(`[ERROR] - [background.ts] - ${JSON.stringify(error)}`);

// Create the logs folder

const sendBackendLogToStudio =
  (title: string, description: string) =>
  (win: Electron.BrowserWindow, data: CallBackArgs) => {
    if (global.initializingBackend) {
      win.webContents.send(
        "electron-log",
        typeof data === "string"
          ? {
              open: true,
              title,
              description,
              output: data,
            }
          : { ...data, title, description },
      );
    }
  };

const successText = "Uvicorn running on";

export const runBackend = (
  workingDir: string,
  win: Electron.BrowserWindow,
): Promise<{
  success: boolean;
  script: childProcess.ChildProcess | undefined;
}> => {
  const backendCommand = getBackendCommand(workingDir);

  console.log("workingDir " + workingDir);
  console.log("backendCommand " + backendCommand);

  return new Promise((resolve) => {
    const title = "Initializing backend...";
    const description =
      "Initialization can take up to few minutes for first time, please be patient!";
    sendBackendLogToStudio(title, description)(win, {
      open: true,
      clear: true,
      output: "Running backend script...",
    });
    runCmd({
      command: backendCommand,
      matchText: successText,
      broadcast: {
        win,
        cb: sendBackendLogToStudio(title, description),
      },
      serviceName: "backend",
    })
      .then(({ script }) => {
        sendBackendLogToStudio(title, description)(win, {
          open: false,
          output: "backend initialized successfully!",
        });
        resolve({ success: true, script });
      })
      .catch((err) => {
        if (err.code > 0) {
          sendBackendLogToStudio(title, description)(win, {
            open: true,
            output: `${err.lastOutput} \n\n Error: Failed to initialize backend, please try relaunching the app!`,
          });
          dialog.showErrorBox("Failed to initialize backend!", err.lastOutput);
          resolve({ success: false, script: undefined });
        }
      });
  });
};

const getBackendCommand = (workingDir: string) => {
  // const isProd: boolean = process.env.NODE_ENV === "production";
  // const isProd: boolean = true;

  // const basePath = isProd ? process.resourcesPath : "";

  const pathToProcess = path.join(workingDir, "../dist-api", "flojoy-service");

  console.log("pathToProcess " + pathToProcess);

  if (process.platform === "win32") {
    // return `pwsh -File ${join(workingDir, "../backend/backend.ps1")}`;
    return `"${pathToProcess}.exe"`;
  }
  return `"${pathToProcess}"`;
  // return `bash "${resolve(join(workingDir, "../backend/backend.sh"))}"`;
};
