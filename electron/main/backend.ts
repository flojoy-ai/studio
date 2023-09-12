import * as childProcess from "child_process";
import path from "path";
import { runCmd } from "./cmd";
import type { CallBackArgs } from "../api/index";
import { dialog } from "electron";

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
  const pathToProcess = path.join(workingDir, "../dist-api", "flojoy-service");

  console.log("pathToProcess " + pathToProcess);

  if (process.platform === "win32") {
    return `"${pathToProcess}.exe"`;
  }
  return `"${pathToProcess}"`;
};
