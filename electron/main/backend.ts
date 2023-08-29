import * as childProcess from "child_process";
import { join, resolve } from "path";
import treeKill from "tree-kill";

const sendBackendLogToStudio = (win: Electron.BrowserWindow, data: string) => {
  if (global.initializingBackend) {
    win.webContents.send("backend", data);
  }
};

export const runCommand = (
  command: string,
  matchText: string,
  win: Electron.BrowserWindow,
): Promise<{
  script: childProcess.ChildProcess;
}> => {
  return new Promise((resolve, reject) => {
    const script = childProcess.exec(command);
    script.stdout?.on("data", function (data) {
      sendBackendLogToStudio(win, data);
      if (data.toString().includes(matchText)) {
        win.webContents.send("backend", "backend initialized successfully!");
        resolve({ script });
      }
    });
    script.stderr?.on("data", function (data) {
      sendBackendLogToStudio(win, data);
      if (data.toString().includes(matchText)) {
        sendBackendLogToStudio(win, "backend initialized successfully!");
        resolve({ script });
      }
    });
    script.addListener("exit", (code) => {
      sendBackendLogToStudio(
        win,
        "Error: Failed to initialize backend try re lunching app!",
      );
      reject({ code });
    });
  });
};

export const killSubProcess = (script: childProcess.ChildProcess) => {
  if (!script.killed) {
    return new Promise((resolve, reject) => {
      treeKill(script.pid ?? 0, (err) => {
        if (err) {
          reject(err);
        }
        resolve(true);
      });
    });
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
    runCommand(backendCommand, successText, win)
      .then(({ script }) => {
        resolve({ success: true, script });
      })
      .catch((err) => {
        if (err.code > 0) {
          resolve({ success: false, script: undefined });
        }
      });
  });
};

const getBackendCommand = (workingDir: string) => {
  if (process.platform === "win32") {
    return `pwsh -File ${join(workingDir, "../backend/backend.ps1")}`;
  }
  return `bash "${resolve(join(workingDir, "../backend/backend.sh"))}"`;
};
