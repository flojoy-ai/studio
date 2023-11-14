/* eslint-disable no-var */
import { BrowserWindow } from "electron";
import api from "./api/index";
import { InterpretersList } from "./main/python/interpreter";

declare global {
  var mainWindow: BrowserWindow;
  var pythonInterpreters: InterpretersList;

  interface Window {
    api: typeof api;
  }
}
