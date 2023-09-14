import * as childProcess from "child_process";
import treeKill from "tree-kill";
import type { BrowserWindow } from "electron";
import { Logger } from "./logger";

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
    const logger = new Logger(serviceName);
    const script = childProcess.exec(command);

    let lastOutput: string;
    script.stdout?.on("data", function (data) {
      const dataStr = `[${serviceName}] - ${data?.toString()}`;
      logger.log(dataStr);
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
      logger.log(dataStr);
      lastOutput = dataStr;
      if (broadcast) {
        broadcast.cb(broadcast.win, dataStr);
      }
      if (matchText && dataStr.includes(matchText)) {
        resolve({ script });
      }
    });
    script.addListener("exit", (code) => {
      logger.log(
        `exited child process [${serviceName}] with code: `,
        code?.toString() ?? "",
      );
      reject({ code, lastOutput });
    });
  });
};

export const killSubProcess = (script: childProcess.ChildProcess) => {
  return new Promise((resolve, reject) => {
    if (!script.killed) {
      treeKill(script.pid ?? 0, (err) => {
        if (err) {
          console.log(
            "error in killing pid: ",
            script.pid,
            " ",
            err.message.toString(),
          );
          reject(err.message.toString());
        } else {
          console.log("killed pid: ", script.pid, " successfully!");
          resolve(true);
        }
      });
    } else {
      resolve(true);
    }
  });
};
