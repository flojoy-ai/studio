import * as childProcess from "child_process";
import treeKill from "tree-kill";
import type { BrowserWindow } from "electron";

type RunCmdProps = {
  command: string;
  matchText?: string;
  broadcast?: {
    win: BrowserWindow;
    cb: (win: BrowserWindow, data: string) => void;
  };
  serviceName: string;
};

export const runCmd = ({
  command,
  broadcast,
  serviceName,
  matchText,
}: RunCmdProps): Promise<{
  script: childProcess.ChildProcess;
}> => {
  return new Promise((resolve, reject) => {
    const script = childProcess.exec(command);
    let lastOutput: string;
    script.stdout?.on("data", function (data) {
      const dataStr = `[${serviceName}] - ${data?.toString()}`;
      lastOutput = dataStr;
      if (broadcast) {
        broadcast.cb(broadcast.win, dataStr);
      }
      if (matchText && dataStr.includes(matchText)) {
        resolve({ script });
      }
    });
    script.stderr?.on("data", function (data) {
      const dataStr = `[${serviceName}] - ${data?.toString()}`;
      lastOutput = dataStr;
      if (broadcast) {
        broadcast.cb(broadcast.win, dataStr);
      }
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
