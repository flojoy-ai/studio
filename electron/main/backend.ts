import * as childProcess from "child_process";
import { join, resolve } from "path";
import treeKill from "tree-kill";

export const runCommand = (
  command: string,
  matchText: string,
): Promise<{
  script: childProcess.ChildProcess;
}> => {
  return new Promise((resolve, reject) => {
    const script = childProcess.exec(command);
    script.stdout?.on("data", function (data) {
      if (data.toString().includes(matchText)) {
        resolve({ script });
      }
    });
    script.stderr?.on("data", function (data) {
      if (data.toString().includes(matchText)) {
        resolve({ script });
      }
    });
    script.addListener("exit", (code) => {
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

const successText = "Application startup complete";

export const runBackend = (
  workingDir: string
): Promise<{
  success: boolean;
  script: childProcess.ChildProcess | undefined;

  data?: string[];
}> => {
  const backendCommand = getBackendCommand(workingDir);

  return new Promise((resolve) => {
    runCommand(backendCommand, successText)
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
  return `sh "${resolve(join(workingDir, "../backend/backend.sh"))}"`;
};
