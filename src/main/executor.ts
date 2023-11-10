import { exec } from "child_process";
import { app } from "electron";
import log from "electron-log/main";
import { Command } from "./command";
import { sendToStatusBar } from "./logging";
// import { openLogFolder } from './logging';

export function execCommand(command: Command): Promise<string> {
  log.info("execCommand: " + command.getCommand());
  return new Promise((resolve, reject) => {
    const child = exec(command.getCommand(), {
      cwd: app.isPackaged ? process.resourcesPath : undefined,
    });

    let stdout = "";
    let errout = "";

    child.stdout?.on("data", (data) => {
      log.info(data);
      stdout += data;
      sendToStatusBar(data);
    });

    child.stderr?.on("data", (data) => {
      log.error(data);
      sendToStatusBar(data);
    });

    child.on("error", (error) => {
      log.error(error.message);
      errout += error.message;
      sendToStatusBar(error.message);
    });

    child.on("close", (code) => {
      if (code === 0) {
        resolve(stdout);
      }
      reject(errout);
    });
  });
}
