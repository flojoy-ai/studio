/* eslint-disable no-var */
import { BrowserWindow } from "electron";
import api from "./api/index";
import { InterpretersList } from "./main/python/interpreter";
import { ChildProcess } from "child_process";

declare global {
  var mainWindow: BrowserWindow;
  var pythonInterpreters: InterpretersList;
  var captainProcess: ChildProcess | null;
  var setupStarted: number;

  interface Window {
    api: typeof api;
  }
}
