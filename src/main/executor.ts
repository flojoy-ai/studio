import { exec } from "child_process";
import { app } from "electron";
import log from "electron-log/main";
import { Command } from "./command";
import { sendToStatusBar } from "./logging";
// import { openLogFolder } from './logging';

export function execCommand(
  command: Command,
  options?: {
    quiet?: boolean;
  },
): Promise<string> {
  log.info("execCommand: " + command.getCommand());
  return new Promise((resolve, reject) => {
    const child = exec(command.getCommand(), {
      cwd: app.isPackaged ? process.resourcesPath : undefined,
    });

    let stdout = "";
    let stderr = "";
    let errout = "";

    const quiet = Boolean(options && options.quiet);

    child.stdout?.on("data", (data) => {
      if (!quiet) {
        sendToStatusBar(data);
      }
      log.info(data);
      stdout += data;
    });

    child.stderr?.on("data", (data) => {
      if (!quiet) {
        sendToStatusBar(data);
      }
      log.error(data);
      stderr += data;
    });

    child.on("error", (error) => {
      log.error(error.message);
      errout += error.message;
      if (!quiet) {
        sendToStatusBar(error.message);
      }
    });


    child.on("close", (code) => {
      if (code === 0) {
        resolve(stdout);
      }

      // exited from 'error' condition, meaning
      // the process could not be spawned/killed
      if (errout !== "") {
        reject(errout);
        return;
      }

      // Note: if you reject with an empty string, Electron does not bubble 
      // it to the renderer properly...
      if (stderr === "") {
        reject("Exited with non-zero exit code, but no output");
      }
      else {
        reject(stderr);
      }
    });
  });
}
