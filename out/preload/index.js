"use strict";
const electron = require("electron");
function saveFile(path, data) {
  electron.ipcRenderer.send("write-file-sync", path, data);
}
async function saveFileAs(defaultFilename, data) {
  const result = await electron.ipcRenderer.invoke(
    "show-save-as-dialog",
    defaultFilename
  );
  if (result.filePath) {
    saveFile(result.filePath, data);
  }
  return result;
}
const fileSave = /* @__PURE__ */ Object.freeze(/* @__PURE__ */ Object.defineProperty({
  __proto__: null,
  saveFile,
  saveFileAs
}, Symbol.toStringTag, { value: "Module" }));
const api = {
  ...fileSave,
  setUnsavedChanges: (value) => electron.ipcRenderer.send("set-unsaved-changes", value),
  subscribeToElectronLogs: (func) => {
    electron.ipcRenderer.on("electron-log", (event, args) => func(args));
  },
  updateBlocksPack: () => {
    electron.ipcRenderer.send("update-blocks-pack");
  },
  updateBlocksResourcePath: () => {
    electron.ipcRenderer.send("change-blocks-resource-path");
  }
};
electron.contextBridge.exposeInMainWorld("api", api);
