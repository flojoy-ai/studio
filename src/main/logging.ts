import { app, ipcMain, shell } from "electron";
import log from "electron-log/main";
import { API } from "../types/api";

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
