import { contextBridge } from "electron";
import api from "../api/index";

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  contextBridge.exposeInMainWorld("api", api);
} else {
  window.api = api;
}
