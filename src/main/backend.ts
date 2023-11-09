import * as childProcess from "child_process";
import { join, resolve } from "path";
import { runCmd } from "./command";
import type { CallBackArgs } from "../api/index";
import { dialog } from "electron";

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
  return new Promise((resolve) => {
    global.initializingBackend = true;
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
          output: ":info: backend initialized successfully!",
        });
        global.initializingBackend = false;
        resolve({ success: true, script });
      })
      .catch((err) => {
        if (err.code > 0) {
          sendBackendLogToStudio(title, description)(win, {
            open: true,
            output: `${err.lastOutput} \n\n Error: Failed to initialize backend, please try relaunching the app!`,
          });
          dialog.showErrorBox(
            "Failed to initialize backend!",
            "Something went wrong while initializing backend!\n Restarting the app might resolve the issue",
          );
          global.initializingBackend = false;

          resolve({ success: false, script: undefined });
        }
      });
  });
};

const getBackendCommand = (workingDir: string) => {
  if (process.platform === "win32") {
    return `pwsh -File ${join(workingDir, "../backend/backend.ps1")}`;
  }
  if (process.platform === "darwin") {
    return `zsh "${resolve(join(workingDir, "../backend/backend.sh"))}"`;
  }
  return `bash "${resolve(join(workingDir, "../backend/backend.sh"))}"`;
};
