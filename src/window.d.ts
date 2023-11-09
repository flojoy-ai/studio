/* eslint-disable no-var */
import { BrowserWindow } from "electron";
import api from "./api/index";

declare global {
  var mainWindow: BrowserWindow;

  interface Window {
    api: typeof api;
  }
}
