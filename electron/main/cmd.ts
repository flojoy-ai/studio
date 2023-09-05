import * as childProcess from "child_process";
import treeKill from "tree-kill";
import type { BrowserWindow } from "electron";

export const runCmd = (
  command: string,
  matchText: string | undefined,
  win: BrowserWindow,
  serviceName: string,
  cb: (win: BrowserWindow, data: string) => void,
): Promise<{
  script: childProcess.ChildProcess;
}> => {
  return new Promise((resolve, reject) => {
    const script = childProcess.exec(command);
    let lastOutput: string;
    script.stdout?.on("data", function (data) {
      const dataStr = `[${serviceName}] - ${data?.toString()}`;
      lastOutput = dataStr;
      cb(win, dataStr);
      if (matchText && dataStr.includes(matchText)) {
        resolve({ script });
      }
    });
    script.stderr?.on("data", function (data) {
      const dataStr = `[${serviceName}] - ${data?.toString()}`;
      lastOutput = dataStr;
      cb(win, dataStr);
      if (matchText && dataStr.includes(matchText)) {
        resolve({ script });
      }
    });
    script.addListener("exit", (code) => {
      reject({ code, lastOutput });
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
