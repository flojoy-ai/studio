import { ipcRenderer } from "electron";
import * as fileSave from "./fileSave";

export default {
  ...fileSave,
  setUnsavedChanges: (value: boolean) =>
    ipcRenderer.send("set-unsaved-changes", value),
  send: (channel:string, data:string) => {
      // whitelist channels
      const validChannels = ['backend'];
      if (validChannels.includes(channel)) {
        ipcRenderer.send(channel, data);
      }
    },
    receive: (channel:string, func:(...arg:string[]) => void) => {
      const validChannels = ['backend'];
      if (validChannels.includes(channel)) {
        // Deliberately strip event as it includes `sender`
        ipcRenderer.on(channel, (event, ...args:string[]) => func(...args));
      }
    }
};
