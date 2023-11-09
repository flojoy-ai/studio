import { app, ipcMain, shell } from "electron";
import * as fs from "fs";
import { join } from "path";
import log from "electron-log/main";
import { API } from "../types/api";

export class Logger {
  private readonly serviceName: string;
  private readonly logStream: fs.WriteStream;
  constructor(serviceName: string = "main") {
    if (serviceName) {
      this.serviceName = serviceName;
    }
    const { logsFolderPath, logFileName } = Logger.getLogFilePath(
      this.serviceName,
    );
    // Append the formatted date and time to the log file name
    if (!fs.existsSync(logsFolderPath)) {
      fs.mkdirSync(logsFolderPath, { recursive: true });
    }
    this.logStream = fs.createWriteStream(join(logsFolderPath, logFileName), {
      flags: "a",
    });
  }
  log(...messages: string[]) {
    messages
      .join("")
      .split("\n")
      .forEach((line) => {
        const logLine = `[${new Date().toISOString()}] - ${
          this.serviceName
        } - ${line}\n`;

        try {
          // Write to the log stream
          this.logStream.write(logLine);
          // Log to the console
          process.stdout.write(logLine);
        } catch (e) {
          throw new Error(`Error in logToFile. Error looks like: ${e}`);
        }
      });
  }
  static getLogFilePath(serviceName: string) {
    const logsFolderPath = join(app.getPath("home"), ".flojoy", "logs");
    const logFileName = `log_${serviceName}.txt`;
    return {
      logsFolderPath,
      logFileName,
      logFilePath: join(logsFolderPath, logFileName),
    };
  }
}

export function openLogFolder(): void {
  shell.openPath(app.getPath("logs"));
}

export function sendToStatusBar(message: string): void {
  ipcMain.emit(API.statusBarLogging, message);
}

export const logListener = (event): void => {
  if (!global?.mainWindow?.isDestroyed()) {
    global.mainWindow?.webContents.send(API.statusBarLogging, event);
  } else {
    log.error("Can't send message to statusBar: mainWindow is destroyed");
  }
};
