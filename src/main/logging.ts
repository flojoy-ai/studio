import { app, dialog, ipcMain, shell } from "electron";
import log from "electron-log/main";
import { API } from "@/api";
import { join } from "path";
import { writeFileSync } from "./utils";
import { readFileSync } from "fs";

export function openLogFolder(): void {
  shell.openPath(app.getPath("logs"));
}

export function sendToStatusBar(message: string): void {
  ipcMain.emit(API.statusBarLogging, message);
  log.info(message);
}

export const logListener = (event): void => {
  if (!global?.mainWindow?.isDestroyed()) {
    global.mainWindow?.webContents.send(API.statusBarLogging, event);
  } else {
    log.error("Can't send message to statusBar: mainWindow is destroyed");
  }
};

export const handleDownloadLogs = () => {
  const logFile = join(app.getPath("logs"), "main.log");
  const logs = readFileSync(logFile).toString();
  const savePath = join(
    app.getPath("downloads"),
    `flojoy-log-${new Date().toISOString().replace(/[-:.]/g, "")}.log`,
  );
  writeFileSync(undefined, savePath, logs);
  dialog
    .showMessageBox(global.mainWindow, {
      type: "info",
      message: "Logs downloaded!",
      detail: `Logs has been downloaded to ${savePath}`,
      buttons: ["OK", "Open File"],
    })
    .then((response) => {
      if (response.response === 0) return;
      shell.openPath(savePath);
    });
};

export const getAllLogs = async () => {
  const logFile = join(app.getPath("logs"), "main.log");
  return await Promise.resolve(readFileSync(logFile).toString());
};
