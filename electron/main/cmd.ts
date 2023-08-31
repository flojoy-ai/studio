import * as childProcess from "child_process";
import { app } from "electron";
import treeKill from "tree-kill";

export const runCmd = (
  command: string,
  matchText: string | undefined,
  win: Electron.BrowserWindow,
  cb: (win: Electron.BrowserWindow, data: string) => void,
): Promise<{
  script: childProcess.ChildProcess;
}> => {
  return new Promise((resolve, reject) => {
    const script = childProcess.exec(command);
    let lastOutput:string;
    script.stdout?.on("data", function (data) {
      lastOutput = data.toString()
      cb(win, data.toString());
      if(!app.isPackaged){
        console.log("[stdout]:: ", data.string())
      }
      if (data.toString().includes(matchText)) {
        console.log("stdout data: ", data.toString(), " includes text: ", matchText)
        resolve({ script });
      }
    });
    script.stderr?.on("data", function (data) {
      lastOutput = data.toString()
      cb(win, data.toString());
      if(!app.isPackaged){
        console.log("[stderr]:: ", data.toString())
      }
      if (data.toString().includes(matchText)) {
        console.log(" data: ", data.toString(), " includes text: ", matchText)
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
